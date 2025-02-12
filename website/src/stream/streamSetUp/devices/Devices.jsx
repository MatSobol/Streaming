import { useState, useEffect } from "react";
import { Form, Card, CardBody, Button, InputGroup } from "react-bootstrap";
import { NamedCard } from "../../../modules/namedCard/NamedCard";
import { CameraSetUp } from "./cameraSetUp/CameraSetUp";
import { Preview } from "./preview/preview";
import { ScreenSetUp } from "./screenSetUp/ScreenSetUp";
import "./device.css";

export const Devices = ({
  recordInfo,
  setRecordInfo,
  videoType,
  setVideoType,
}) => {
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStream.getTracks().forEach((track) => track.stop());
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();

      const audioSelect = [];
      const videoSelect = [];
      console.log(deviceInfos);
      for (const deviceInfo of deviceInfos) {
        const value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
          const text =
            deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
          audioSelect.push(
            <option value={value} key={value}>
              {text}
            </option>
          );
        } else if (deviceInfo.kind === "videoinput") {
          const text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
          videoSelect.push(
            <option value={value} key={value}>
              {text}
            </option>
          );
        }
      }
      setRecordInfo({
        ...recordInfo,
        audioDevice: audioSelect[0].props.value,
        videoDevice: videoSelect[0].props.value,
      });
      setAudioDevices(audioSelect);
      setVideoDevices(videoSelect);
    };

    fetchDevices();
  }, []);

  return (
    <>
      <Preview
        recordInfo={recordInfo}
        setRecordInfo={setRecordInfo}
        showPreview={showPreview}
        onhide={() => setShowPreview(false)}
        videoType={videoType}
      />
      <NamedCard name={"Devices"}>
        <div key={"inline-radio"} className="mb-3">
          <Form.Check
            inline
            readOnly
            checked={!videoType}
            onClick={() => setVideoType(0)}
            label="Camera"
            name="group1"
            type="radio"
          />
          <Form.Check
            inline
            readOnly
            checked={videoType}
            onClick={() => setVideoType(1)}
            label="Screen"
            name="group1"
            type="radio"
          />
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text>Microphone</InputGroup.Text>
          <Form.Select
            onChange={(e) =>
              setRecordInfo({
                ...recordInfo,
                audioDevice: e.currentTarget.value,
              })
            }
          >
            {audioDevices}
          </Form.Select>
        </InputGroup>
        {!videoType ? (
          <CameraSetUp
            recordInfo={recordInfo}
            setRecordInfo={setRecordInfo}
            videoDevices={videoDevices}
          />
        ) : (
          <ScreenSetUp recordInfo={recordInfo} setRecordInfo={setRecordInfo} />
        )}

        <Button className="px-3" onClick={() => setShowPreview(true)}>
          <i className="bi bi-eye customIcon"></i> Preview
        </Button>
      </NamedCard>
    </>
  );
};
