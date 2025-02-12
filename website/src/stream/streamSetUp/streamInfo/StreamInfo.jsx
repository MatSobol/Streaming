import { useState, useRef, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { DragAndDropInput } from "../../../modules/dragAndDropInput/DragAndDropInput";
import { NamedCard } from "../../../modules/namedCard/NamedCard";
import { Tags } from "./Tags/Tags";

export const StreamInfo = ({ dataToSend, setDataToSend }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      setDataToSend({ ...dataToSend, image: inputRef });
    }
  }, []);
  return (
    <NamedCard name={"Stream info"}>
      <DragAndDropInput inputRef={inputRef} />
      <InputGroup className="mb-3">
        <InputGroup.Text>Title</InputGroup.Text>
        <Form.Control
          value={dataToSend.title}
          onChange={(e) =>
            setDataToSend({ ...dataToSend, title: e.target.value })
          }
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Description</InputGroup.Text>
        <Form.Control
          value={dataToSend.description}
          onChange={(e) =>
            setDataToSend({ ...dataToSend, description: e.target.value })
          }
          as="textarea"
        />
      </InputGroup>
      <Tags dataToSend={dataToSend} setDataToSend={setDataToSend} />
    </NamedCard>
  );
};
