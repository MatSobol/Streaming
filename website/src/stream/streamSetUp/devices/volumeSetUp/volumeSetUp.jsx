import { Form } from "react-bootstrap";
import "./volumeSetUp.css";

export const VomuleSetUp = ({
  noAudio,
  recordInfo,
  setRecordInfo,
  volumeControlRef,
}) => {
  const VolumeIcon = () => {
    const volumeMute = () => {
      setRecordInfo({ ...recordInfo, screenVolume: 0.0 });
    };

    const volumeFloat = parseFloat(recordInfo.screenVolume);

    if (volumeFloat === 0.0)
      return (
        <i
          onClick={() => volumeMute()}
          className="bi bi-volume-mute screenVolumeIcon"
        ></i>
      );
    if (volumeFloat > 0.0 && volumeFloat < 0.5)
      return (
        <i
          onClick={() => volumeMute()}
          className="bi bi-volume-off screenVolumeIcon"
        ></i>
      );
    if (volumeFloat >= 0.5 && volumeFloat < 1)
      return (
        <i
          onClick={() => volumeMute()}
          className="bi bi-volume-down screenVolumeIcon"
        ></i>
      );
    if (volumeFloat >= 1)
      return (
        <i
          onClick={() => volumeMute()}
          className="bi bi-volume-up screenVolumeIcon"
        ></i>
      );
    return <></>;
  };

  return (
    <>
      <div className="d-flex">
        <VolumeIcon />
        <Form.Range
          ref={volumeControlRef}
          value={recordInfo.screenVolume}
          onChange={(e) =>
            setRecordInfo({ ...recordInfo, screenVolume: e.target.value })
          }
          min={0.0}
          max={1.5}
          step={0.01}
          disabled={noAudio}
        />
      </div>
    </>
  );
};
