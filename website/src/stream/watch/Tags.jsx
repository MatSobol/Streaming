import { useState } from "react";

export const TagsWatch = ({ tags }) => {
  const [hidden, setHidden] = useState(true);
  return (
    <>
      <h5 className="text-start mb-3">Tags:</h5>
      <div className="d-flex align-items-top gap-3">
        <div
          className={
            "tags-container-watch" +
            (hidden ? " tags-container-watch-hidden" : "")
          }
        >
          {tags.map((el, idx) => {
            return (
              <div key={idx} className="tag">
                {el}
              </div>
            );
          })}
        </div>
        <div className="icon-container-watch d-flex align-items-center me-3">
          <i
            class="bi bi-chevron-down"
            onClick={() => setHidden((el) => !el)}
          ></i>
        </div>
      </div>
    </>
  );
};
