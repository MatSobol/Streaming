import { useAuthHeader } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { Button } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { successAlert, failAlert } from "@/store/slices/alertSlice";

import { Stream } from "../Stream";
import { useEffect, useState, useRef } from "react";
import { rtcConnection } from "../rtcConnection";

export const Streaming = () => {
  const dispatch = useDispatch();

  const videoRef = useRef(null);

  const [running, setRunning] = useState(false);

  const { state } = useLocation();
  const { streamInfo, recordInfo, videoType } = state;

  const StreamFun = Stream(recordInfo, videoType, (el) => {});

  const auth = useAuthHeader();
  const streamUrl =
    import.meta.env.VITE_SERVER_URL +
    import.meta.env.VITE_REST_API_PORT +
    import.meta.env.VITE_STREAM_ENDPOINT;

  const addStream = async () => {
    const formData = new FormData();
    const image = streamInfo.image;
    delete streamInfo.image;
    formData.append("document", JSON.stringify(streamInfo));
    formData.append("file", image);
    try {
      const response = await axios.post(streamUrl, formData, {
        headers: {
          authorization: auth(),
        },
      });
      return response.data.Id;
    } catch (e) {
      if (e?.response?.data) {
        dispatch(failAlert(e.response.data.Response));
      } else {
        dispatch(failAlert("Problem with server"));
      }
    }
  };

  useEffect(() => {
    if (!running) {
      StreamFun.stopMediaStream();
      return;
    }
    let ws, pc, streamId;
    const startMediaStream = async () => {
      streamId = await addStream();
      const mediaStream = await StreamFun.fetchMediaStream();
      videoRef.current.srcObject = mediaStream;
      [ws, pc] = rtcConnection(mediaStream, streamId);
    };
    startMediaStream();
    return () => {
      console.log("closing webrtc connection");
      ws.send("close");
      ws.close();
      axios.get(`${streamUrl}/stop/${streamId}`, {
        headers: {
          authorization: auth(),
        },
      });
    };
  }, [running]);

  return (
    <div>
      <video
        className="videoDisplay"
        ref={videoRef}
        autoPlay={true}
        id="videoElement"
      ></video>
      {!running ? (
        <Button className="mt-3 me-3" onClick={() => setRunning(true)}>
          Start
        </Button>
      ) : (
        <Button className="mt-3" onClick={() => setRunning(false)}>
          Stop
        </Button>
      )}
    </div>
  );
};
