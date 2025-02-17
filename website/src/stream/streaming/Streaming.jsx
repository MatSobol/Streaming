import { useAuthHeader } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { useDispatch } from "react-redux";
import { successAlert, failAlert } from "@/store/slices/alertSlice";

import { Stream } from "../Stream";
import { useEffect, useState, useRef } from "react";
import { rtcConnection } from "../rtcConnection";
import { VomuleSetUp } from "../volumeSetUp/volumeSetUp";

import "./Streaming.css";

export const Streaming = () => {
  const dispatch = useDispatch();

  const videoRef = useRef(null);

  const [running, setRunning] = useState(false);
  const [isMicrophone, setIsMicrophone] = useState(true);

  const { state } = useLocation();
  const { streamInfo, recordInfo, videoType } = state;
  const [recordInfoState, setRecordInfoState] = useState(recordInfo);
  const StreamFun = Stream(recordInfoState, videoType, (el) => {});

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
    const startMediaStream = async (StreamFun) => {
      streamId = await addStream();
      const mediaStream = await StreamFun.fetchMediaStream();
      videoRef.current.srcObject = mediaStream;
      [ws, pc] = rtcConnection(mediaStream, streamId);
    };
    startMediaStream(StreamFun);
    return () => {
      console.log("closing webrtc connection");
      ws.send("close");
      ws.close();
      pc.close();
    };
  }, [running]);

  const toggleMicrophone = () => {
    StreamFun.toggleMicrophone();
    setIsMicrophone((el) => !el);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <video
        className="streamingVideoDisplay"
        ref={videoRef}
        autoPlay={true}
        id="videoElement"
      ></video>
      {!running ? (
        <i
          class="bi bi-caret-right-fill mt-3 me-3 iconSuccess"
          onClick={() => setRunning(true)}
        ></i>
      ) : (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <i
            class="bi bi-stop-fill iconDanger"
            onClick={() => setRunning(false)}
          ></i>
          {isMicrophone ? (
            <i
              class="bi bi-mic-mute-fill iconDanger"
              onClick={() => toggleMicrophone()}
            ></i>
          ) : (
            <i
              class="bi bi-mic-fill iconSuccess"
              onClick={() => toggleMicrophone()}
            ></i>
          )}
          {state.videoType === 1 && (
            <div style={{height: "1.5rem"}}>
              <VomuleSetUp
                recordInfo={recordInfoState}
                setRecordInfo={setRecordInfoState}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
