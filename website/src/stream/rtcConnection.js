export const rtcConnection = (mediaStreams, streamId, auth) => {
  let pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });

  const ws = new WebSocket(
    "ws://localhost" + import.meta.env.VITE_INGEST_API_PORT
  );
  console.log("Websocket opened");

  ws.onmessage = function (event) {
    const parts = event.data.split(/:(.*)/s);
    switch (parts[0]) {
      case "iceCandidate":
        pc.addIceCandidate(
          new RTCIceCandidate({
            candidate: parts[1],
            sdpMid: "",
            sdpMLineIndex: 0,
          })
        );
        break;
      case "offer":
        pc.setRemoteDescription(JSON.parse(atob(parts[1])));
        break;
      default:
        console.log(event);
        break;
    }
  };

  ws.onopen = () => {
    ws.send(`init:${streamId}`);
    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      ws.send("offer:" + btoa(JSON.stringify(offer)));
    });

    pc.oniceconnectionstatechange = (e) => console.log(pc.iceConnectionState);
    pc.onicecandidate = (event) => {
      if (event.candidate !== null) {
        ws.send("iceCandidate:" + event.candidate.candidate);
      }
    };
  };

  ws.onerror = function (error) {
    console.error("WebSocket error: ", error);
  };

  ws.onclose = () => {
    console.log("close");
    ws.close();
  };

  mediaStreams.getTracks().forEach((track) => pc.addTrack(track, mediaStreams));
  return [ws, pc];
};
