import { useEffect, useContext, useState, useRef } from "react";
import { Stream } from "../../../Stream";
import { VomuleSetUp } from "../../../volumeSetUp/volumeSetUp";
import { useDispatch } from "react-redux";
import { failAlert } from "@/store/slices/alertSlice";
import "./preview.css";

export const Preview = ({
  recordInfo,
  setRecordInfo,
  showPreview,
  onhide,
  videoType,
}) => {
  const dispath = useDispatch();
  const videoRef = useRef(null);
  const volumeControlRef = useRef(null);
  const [noAudio, setNoAudio] = useState(false);
  const stream = Stream(recordInfo, videoType, setNoAudio);
  useEffect(() => {
    if (!showPreview) {
      stream.stopMediaStream();
      return;
    }
    const fetchMediaStream = async () => {
      try {
        const mediaStream = await stream.fetchMediaStream();
        videoRef.current.srcObject = mediaStream;
      } catch (e) {
        onhide();
        if (e.name === "OverconstrainedError") {
          dispath(failAlert("Bad Resolution"));
        } else {
          dispath(failAlert(e.message));
        }
        console.log(e);
        return;
      }
    };
    fetchMediaStream();
  }, [showPreview]);

  const handleClickOutside = (e) => {
    if (
      !volumeControlRef.current ||
      (volumeControlRef.current && e.target !== volumeControlRef.current)
    ) {
      onhide();
    }
  };

  return (
    <>
      <div
        className="modalVideoPreview"
        style={{ display: showPreview ? "flex" : "none" }}
        onClick={(e) => handleClickOutside(e)}
      >
        <div style={{ position: "relative" }}>
          {videoType ? (
            <div className="volumeControl">
              <div className="mb-1">Screen volume</div>
              <div className="volumeControlContainer">
                <VomuleSetUp
                  volumeControlRef={volumeControlRef}
                  noAudio={noAudio}
                  recordInfo={recordInfo}
                  setRecordInfo={setRecordInfo}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <video
            className="videoDisplay"
            ref={videoRef}
            autoPlay={true}
            id="videoElement"
          ></video>
        </div>
      </div>
    </>
  );
};
