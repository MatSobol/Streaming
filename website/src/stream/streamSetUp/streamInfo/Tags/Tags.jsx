import { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import "./tags.css";

export const Tags = ({ dataToSend, setDataToSend }) => {
  const [newTag, setNewTag] = useState("");

  const deleteTag = (tag) => {
    const tagsCopy = dataToSend.tags;
    const index = tagsCopy.indexOf(tag);
    tagsCopy.splice(index, 1);
    setDataToSend({ ...dataToSend, tags: tagsCopy });
  };

  const addNewTag = () => {
    if (dataToSend.tags.includes(newTag)) {
      setNewTag("");
      return;
    }
    const newTagList = [...dataToSend.tags, newTag];
    setDataToSend({ ...dataToSend, tags: newTagList });
    setNewTag("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const TagElements = () => {
    const tagsDiv = [];
    if (!dataToSend.tags) {
      return <></>;
    }
    return (
      <div className="d-flex flex-wrap mt-3 gap-2 tagConatiner">
        {dataToSend.tags
          .slice()
          .reverse()
          .map((el, idx) => {
            return (
              <div className="tag" key={idx}>
                {el}
                <i
                  className="ms-1 bi bi-trash trashIcon customIcon"
                  onClick={() => deleteTag(el)}
                ></i>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <>
      <InputGroup>
        <InputGroup.Text>Tags</InputGroup.Text>
        <Form.Control
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <Button
          className="buttonAddTags"
          variant="outline-secondary"
          onClick={addNewTag}
        >
          Add
        </Button>
      </InputGroup>
      <TagElements />
    </>
  );
};
