import { useLocation } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

const ReactHlsPlayer = lazy(() => import("react-hls-player"));
import "../streamSetUp/streamInfo/Tags/tags.css";
import "./watch.css";

export const Watch = () => {
  const { state } = useLocation();
  const [hidden, setHidden] = useState(false);
  console.log(state)
  return (
    <div className="mt-3 ms-3 me-3 watch-container">
      <h1 className="text-start">{state.title}</h1>
      { state.live &&
      <Suspense fallback={<div>Loading video player...</div>}>
        <ReactHlsPlayer
          src={`http://localhost:8001/live/${state._id}/index.m3u8`}
          autoPlay={true}
          controls={true}
          width="100%"
          height="auto"
        />
      </Suspense>
      }
      {state.tags.length > 0 && (
        <>
          <h5 className="text-start mb-3">Tags:</h5>
          <div className="d-flex align-items-top gap-3">
            <div
              className={
                "tags-container-watch" +
                (hidden ? " tags-container-watch-hidden" : "")
              }
            >
              {state.tags.map((el, idx) => {
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
      )}
      {state.description && (
        <>
          <h5 className="text-start mt-3">Description: </h5>
          <div className="mt-3 text-start">{state.description}</div>
        </>
      )}
    </div>
  );
};
