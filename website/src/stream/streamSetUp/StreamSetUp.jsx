import { useNavigate } from "react-router-dom";

import { StreamInfo } from "./streamInfo/StreamInfo";
import { Devices } from "./devices/Devices";
import { Button } from "react-bootstrap";
import { useState } from "react";

import "./streamSetUp.css";

export const StreamSetUp = () => {
  const [videoType, setVideoType] = useState(0);
  const navigate = useNavigate();

  const [streamInfo, setStreamInfo] = useState({
    tags: [],
    title: "",
    description: "",
    live: true,
  });

  const [recordInfo, setRecordInfo] = useState({
    resolution: "default",
    screenVolume: "1.0",
  });

  const initStreaming = () => {
    const data = {
      streamInfo: { ...streamInfo, image: streamInfo.image.current.files[0] },
      recordInfo: { ...recordInfo },
      videoType: videoType,
    };
    navigate("streaming", {
      state: data,
    });
  };

  return (
    <form className="p-3 streamContainer">
      <h2 className="mb-3">Stream setup</h2>
      <StreamInfo dataToSend={streamInfo} setDataToSend={setStreamInfo} />
      <Devices
        recordInfo={recordInfo}
        setRecordInfo={setRecordInfo}
        videoType={videoType}
        setVideoType={setVideoType}
      />
      <Button className="px-4" variant="success" onClick={initStreaming}>
        Finish setup
      </Button>
    </form>
  );
};
