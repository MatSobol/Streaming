import { useState } from "react";
import { Form, InputGroup, Button, Dropdown } from "react-bootstrap";

const POSSIBLE_RESOLUTIONS = [
  "default",
  "1280x720",
  "1920x1080",
  "2560x1440",
  "3840x2160",
];

export const CameraSetUp = ({ recordInfo, setRecordInfo, videoDevices }) => {
  const [customResolution, setCustomResolution] = useState(false);

  const DropDownItems = () => {
    const itemsDivs = [];

    POSSIBLE_RESOLUTIONS.forEach((item, idx) => {
      itemsDivs.push(
        <Dropdown.Item
          key={idx}
          onClick={(e) => setRecordInfo({ ...recordInfo, resolution: item })}
        >
          {item}
        </Dropdown.Item>
      );
    });

    return <Dropdown.Menu>{itemsDivs}</Dropdown.Menu>;
  };

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text>Video</InputGroup.Text>
        <Form.Select
          onChange={(e) => setRecordInfo({ ...recordInfo, resolution: e.target.innerText })}
        >
          {videoDevices}
        </Form.Select>
      </InputGroup>
      {!customResolution ? (
        <div className="customResolutionButtonContainer mb-3">
          <Button
            variant="outline-secondary"
            className="buttonAddTags customResolutionButton"
            onClick={() => setCustomResolution(true)}
          >
            Custom resolution
          </Button>
        </div>
      ) : (
        <InputGroup className="mb-3">
          <InputGroup.Text>Resolution</InputGroup.Text>
          <Form.Control
            value={recordInfo.resolution}
            onChange={(e) =>
              setRecordInfo({ ...recordInfo, resolution: e.currentTarget.value })
            }
          />
          <Dropdown>
            <Dropdown.Toggle
              className="buttonAddTags"
              variant="outline-secondary"
            >
              resolutions
            </Dropdown.Toggle>
            <DropDownItems />
          </Dropdown>
        </InputGroup>
      )}
    </>
  );
};
