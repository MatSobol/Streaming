package pkg

import (
	"os/exec"
	"os"
	"fmt"
	"strconv"
)

const RTP_FOLDER = "/bin/rtp/"

func Ffmpeg (c <-chan []byte, port int, streamId string) {

	data := fmt.Sprintf(
        "v=0\n"+
        "o=- 0 0 IN IP4 127.0.0.1\n"+
        "s=Pion WebRTC\n"+
        "c=IN IP4 127.0.0.1\n"+
        "t=0 0\n"+
        "m=audio " + strconv.Itoa(port) + " RTP/AVP 111\n"+
        "a=rtpmap:111 OPUS/48000/2\n"+
        "m=video " + strconv.Itoa(port + 2) + " RTP/AVP 96\n"+
        "a=rtpmap:96 VP8/90000\n")

	file, err := os.Create(RTP_FOLDER + strconv.Itoa(port) + ".sdp")
	if err != nil {
		panic(err)
	}

	_, err = file.WriteString(data)
	if err != nil {
		panic(err)
	}
	file.Close()

	cmd := exec.Command("ffmpeg",
		"-protocol_whitelist", "file,udp,rtp",
		"-y",
		"-i", RTP_FOLDER + strconv.Itoa(port) + ".sdp",
		"-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2",
		"-c:v", "libx264",
		"-preset", "veryfast",
		"-b:v", "3000k",
		"-maxrate", "3000k",
		"-bufsize", "6000k",
		"-pix_fmt", "yuv420p",
		"-g", "50",
		"-c:a", "aac",
		"-b:a", "160k",
		"-ac", "2",
		"-ar", "44100",
		"-f", "flv",
		"-max_interleave_delta", "0",
		"rtmp://media-server:1935/live/" + streamId,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stdout
	stdin, err := cmd.StdinPipe()

	if err != nil {
		panic(err)
	}

	if err := cmd.Start(); err != nil {
		panic(err)
	}

	value := <- c
	if(value != nil){
		fmt.Println("finished")
		e := os.Remove(RTP_FOLDER + strconv.Itoa(port) + ".sdp") 
		if e != nil { 
			panic(e) 
		} 
		stdin.Write([]byte("q\n"))
		return
	}
	return
}