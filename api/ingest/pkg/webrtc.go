package pkg

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
	"net"
	"net/http"
	"errors"
	"bytes"
	"os"
	"io"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/pion/interceptor"
	"github.com/pion/interceptor/pkg/intervalpli"
	"github.com/pion/rtp"
	"github.com/pion/webrtc/v4"

)

const StartingUdpPort = 4002

type udpConn struct {
	conn        *net.UDPConn
	port        int
	payloadType uint8
}

type Port struct{
	Val int
	IsUsed bool
}

type PortList struct {
	mu sync.Mutex
	Ports []Port
}

func Write(conn *websocket.Conn, c chan []byte) {
	for message := range c {
		conn.WriteMessage(websocket.TextMessage, message)
	}
}

func Connect(conn *websocket.Conn, portList *PortList, streamId string) {

	defer func(){
		data := map[string]string{"key": os.Getenv("LOCAL_KEY")}
		jsonData, _ := json.Marshal(data)
	
		_, err := http.Post("http://rest:8000/stream/stop/" + streamId, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Println("Error:", err)
			panic(err)
		}
	}()

	messageChannel := make(chan []byte)
	ffmpegChannel := make(chan []byte)

	var chosenPort int = -1

	portList.mu.Lock()
	for i := 0; i < len(portList.Ports); i++{
		if(!portList.Ports[i].IsUsed){
			portList.Ports[i].IsUsed = true
			chosenPort = portList.Ports[i].Val
			break
		}
	}
	if(chosenPort == -1){
		portList.Ports = append(portList.Ports, Port{Val: portList.Ports[len(portList.Ports) - 1].Val, IsUsed: true})
	}
	portList.mu.Unlock()

	fmt.Println(chosenPort)

	go Write(conn, messageChannel)
	go Ffmpeg(ffmpegChannel, chosenPort, streamId)
	defer close(messageChannel)

	m := &webrtc.MediaEngine{}

	if err := m.RegisterCodec(webrtc.RTPCodecParameters{
		RTPCodecCapability: webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeVP8, ClockRate: 90000, Channels: 0, SDPFmtpLine: "", RTCPFeedback: nil},
	}, webrtc.RTPCodecTypeVideo); err != nil {
		panic(err)
	}
	if err := m.RegisterCodec(webrtc.RTPCodecParameters{
		RTPCodecCapability: webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus, ClockRate: 48000, Channels: 0, SDPFmtpLine: "", RTCPFeedback: nil},
	}, webrtc.RTPCodecTypeAudio); err != nil {
		panic(err)
	}

	i := &interceptor.Registry{}

	intervalPliFactory, err := intervalpli.NewReceiverInterceptor()
	if err != nil {
		panic(err)
	}
	i.Add(intervalPliFactory)

	if err = webrtc.RegisterDefaultInterceptors(m, i); err != nil {
		panic(err)
	}

	api := webrtc.NewAPI(webrtc.WithMediaEngine(m), webrtc.WithInterceptorRegistry(i))

	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	peerConnection, err := api.NewPeerConnection(config)
	if err != nil {
		panic(err)
	}
	defer func() {
		if cErr := peerConnection.Close(); cErr != nil {
			fmt.Printf("cannot close peerConnection: %v\n", cErr)
		}
	}()

	if _, err = peerConnection.AddTransceiverFromKind(webrtc.RTPCodecTypeAudio); err != nil {
		panic(err)
	} else if _, err = peerConnection.AddTransceiverFromKind(webrtc.RTPCodecTypeVideo); err != nil {
		panic(err)
	}

	var laddr *net.UDPAddr
	if laddr, err = net.ResolveUDPAddr("udp", "127.0.0.1:"); err != nil {
		panic(err)
	}

	udpConns := map[string]*udpConn{
		"audio": {port: chosenPort, payloadType: 111},
		"video": {port: chosenPort + 2, payloadType: 96},
	}
	
	for _, conn := range udpConns {
		var raddr *net.UDPAddr
		if raddr, err = net.ResolveUDPAddr("udp", fmt.Sprintf("127.0.0.1:%d", conn.port)); err != nil {
			panic(err)
		}

		if conn.conn, err = net.DialUDP("udp", laddr, raddr); err != nil {
			panic(err)
		}
		defer func(conn net.PacketConn) {
			if closeErr := conn.Close(); closeErr != nil {
				panic(closeErr)
			}
			portList.mu.Lock()
			portList.Ports[chosenPort - StartingUdpPort].IsUsed = false
			portList.mu.Unlock()
		}(conn.conn)
	}

	peerConnection.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		conn, ok := udpConns[track.Kind().String()]
		if !ok {
			return
		}

		buf := make([]byte, 1500)
		rtpPacket := &rtp.Packet{}
		for {
			n, _, readErr := track.Read(buf)
			if readErr != nil {
				if readErr == io.EOF{
					return
				}
				panic(readErr)
			}

			if err = rtpPacket.Unmarshal(buf[:n]); err != nil {
				panic(err)
			}
			rtpPacket.PayloadType = conn.payloadType

			if n, err = rtpPacket.MarshalTo(buf); err != nil {
				panic(err)
			}

			if _, writeErr := conn.conn.Write(buf[:n]); writeErr != nil {
				var opError *net.OpError
				if errors.As(writeErr, &opError) && opError.Err.Error() == "write: connection refused" {
					continue
				}
				panic(err)
			}
		}
	})

	peerConnection.OnICEConnectionStateChange(func(connectionState webrtc.ICEConnectionState) {
		fmt.Printf("Connection State has changed %s \n", connectionState.String())
	})

	peerConnection.OnICECandidate(func(i *webrtc.ICECandidate) {
		if i != nil {
			fmt.Println("sending Candidate")
			messageChannel <- []byte("iceCandidate:" + i.ToJSON().Candidate)
		}
	})  

	offer := webrtc.SessionDescription{}

	loop:
	for {
		_, message, err := conn.ReadMessage()

		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				fmt.Sprintln("Websocket closed")
				break loop
			}
			panic(err)
		}
		
		parts := strings.SplitN(string(message), ":", 2)

		switch parts[0] {
		case "iceCandidate":
			fmt.Println("iceCandidate")
			zeroVal := uint16(0)
			emptyStr := ""
			if iceErr := peerConnection.AddICECandidate(webrtc.ICECandidateInit{
				Candidate:     fmt.Sprintf("candidate:%s", parts[1]),
				SDPMid:        &emptyStr,
				SDPMLineIndex: &zeroVal,
			});
			iceErr != nil {
				panic(iceErr)
			}
		case "offer":
			fmt.Println("offer")
			decode(parts[1], &offer)
			if err = peerConnection.SetRemoteDescription(offer); err != nil {
				panic(err)
			}
			answer, err := peerConnection.CreateAnswer(nil)
			if err != nil {
				panic(err)
			}
		
			if err = peerConnection.SetLocalDescription(answer); err != nil {
				panic(err)
			}
			messageChannel <- []byte("offer:" + encode(peerConnection.LocalDescription()))
		case "close":
			fmt.Println("Webrtc connection closed")
			ffmpegChannel <- []byte("close")
			break loop
		default:
			panic(fmt.Sprintf("message not expected %s", string(message)))
			break loop
		}
	}
}

func encode(obj *webrtc.SessionDescription) string {
	b, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}

	return base64.StdEncoding.EncodeToString(b)
}

func decode(in string, obj *webrtc.SessionDescription) {
	b, err := base64.StdEncoding.DecodeString(in)
	if err != nil {
		panic(err)
	}

	if err = json.Unmarshal(b, obj); err != nil {
		panic(err)
	}
}
