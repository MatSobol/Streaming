import { Form } from "react-bootstrap";
import { VomuleSetUp } from "../volumeSetUp/volumeSetUp";
import "./screenSetUp.css";

export const ScreenSetUp = ({ recordInfo, setRecordInfo }) => {
  return (
    <>
      <div className="screenVolumeLabel">
        <Form.Label>Screen volume:</Form.Label>
      </div>
      <VomuleSetUp recordInfo={recordInfo} setRecordInfo={setRecordInfo} />
    </>
  );
};
