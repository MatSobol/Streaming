import ReactHlsPlayer from "react-hls-player";
import { Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export const Watch = () => {
  const { state } = useLocation();
  return (
    <div>
      <ReactHlsPlayer
        src={`http://localhost:8001/live/${state._id}/index.m3u8`}
        autoPlay={true}
        controls={true}
        width="100%"
        height="auto"
      />
    </div>
  );
};
