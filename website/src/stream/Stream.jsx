import { useRef, useState, useEffect } from "react";

export const Stream = (recordInfo, videoType, setNoAudio, randNum) => {
  const [widthVideo, heightVideo] = recordInfo.resolution.split("x");
  const [mediaStream, setMediaStream] = useState([]);
  const gainNodeRef = useRef(null);
  const audioContextRef = useRef(null);
  const rnum = randNum;

  // for default will give widthVideo = "default" and heightVideo=undefined
  const constraintsVideoType = {
    audio: { deviceId: { exact: recordInfo.audioDevice } },
    video: {
      deviceId: { exact: recordInfo.videoDevice },
      width: widthVideo !== "default" ? { exact: widthVideo } : undefined,
      height: heightVideo ? { exact: heightVideo } : undefined,
    },
  };

  const constraintsScreenType = {
    video: {
      logicalSurface: true,
      cursor: "always",
    },
    audio: true,
  };

  const microphoneConstraints = {
    video: false,
    audio: { deviceId: { exact: recordInfo.audioDevice } },
  };

  const screenMediaStream = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia(
      constraintsScreenType
    );
    const microphone = await navigator.mediaDevices.getUserMedia(
      microphoneConstraints
    );
    setMediaStream([screen, microphone]);

    const combinedStream = new MediaStream();

    if (screen.getAudioTracks().length > 0) {
      setNoAudio(false);
      const audioContext = new AudioContext();
      const gainNode = audioContext.createGain();
      const screenSource = audioContext.createMediaStreamSource(screen);
      const microphoneSource = audioContext.createMediaStreamSource(microphone);
      screenSource.connect(gainNode);
      const audioDestination = audioContext.createMediaStreamDestination();
      gainNode.connect(audioDestination);
      gainNode.gain.value = recordInfo.screenVolume;
      microphoneSource.connect(audioDestination);

      gainNodeRef.current = gainNode;
      audioContextRef.current = audioContext;
      combinedStream.addTrack(audioDestination.stream.getAudioTracks()[0]);
    } else {
      setNoAudio(true);
    }

    combinedStream.addTrack(screen.getVideoTracks()[0]);
    // combinedStream.addTrack(microphone.getAudioTracks()[0]);

    return combinedStream;
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = recordInfo.screenVolume;
    }
  }, [recordInfo.screenVolume]);

  const stopMediaStream = () => {
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStream.length !== 0) {
      mediaStream.forEach((el) => {
        el.getTracks().forEach((track) => track.stop());
      });
      setMediaStream([]);
    }
  };

  const fetchMediaStream = async () => {
    let preparedStream;
    if (!videoType) {
      const localStream = await navigator.mediaDevices.getUserMedia(
        constraintsVideoType
      );
      setMediaStream([localStream]);
      preparedStream = localStream;
    } else {
      preparedStream = await screenMediaStream();
    }
    return preparedStream;
  };

  return {
    stopMediaStream: stopMediaStream,
    fetchMediaStream: fetchMediaStream,
  };
};
