import { useState } from "react";
import "./dragAndDropInput.css";

export const DragAndDropInput = ({ inputRef }) => {
  const [image, setImage] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    inputRef.current.files = event.dataTransfer.files;
    setImage(URL.createObjectURL(event.dataTransfer.files[0]));
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div
      className="dragAndDropInputContainer mb-3"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      {image ? (
        <img src={image} className="previewImage" />
      ) : (
        <>
          <i className="bi bi-upload iconUpload"></i>
          <div id="thumbnailText">Stream thumbnail</div>
          <div>Chose file or drag here</div>
        </>
      )}
      <input
        onChange={onImageChange}
        type="file"
        ref={inputRef}
        accept="image/png, image/jpeg"
        id="dragAndDropHiddenInputElement"
      ></input>
    </div>
  );
};
