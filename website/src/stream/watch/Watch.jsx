import { useLocation } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import { TagsWatch } from "./Tags";

const ReactHlsPlayer = lazy(() => import("react-hls-player"));
import "../streamSetUp/streamInfo/Tags/tags.css";
import "./watch.css";

export const Watch = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <div className="mt-3 ms-3 me-3 watch-container">
      <h1 className="text-start">{state.title}</h1>
      {state.live && (
        <Suspense fallback={<div>Loading video player...</div>}>
          <ReactHlsPlayer
            src={`http://localhost:8001/live/${state._id}/index.m3u8`}
            autoPlay={true}
            controls={true}
            width="100%"
            height="auto"
          />
        </Suspense>
      )}
      {state.tags.length > 0 && <TagsWatch tags={state.tags} />}
      {state.description && (
        <>
          <h5 className="text-start mt-3">Description: </h5>
          <div className="mt-3 text-start">{state.description}</div>
        </>
      )}
    </div>
  );
};
