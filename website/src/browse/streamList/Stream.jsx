import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

import "./Stream.css";

export const Stream = ({ stream }) => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const mediaUrl =
    import.meta.env.VITE_SERVER_URL +
    import.meta.env.VITE_REST_API_PORT +
    import.meta.env.VITE_MEDIA_ENDPOINT;

  return (
    <Card
      className="streamContainer"
      onClick={() => {
        navigate(`/watch/${stream._id}`, {
          state: stream,
        });
      }}
    >
      {stream?.live && <div className="liveIcon">LIVE</div>}
      {!loaded && (
        <div className="imagePlaceholder">
          <i className="bi bi-card-image"></i>
        </div>
      )}
      {stream.imagePath && (
        <Card.Img
          style={{
            width: "300px",
            height: "0px",
          }}
          loading="lazy"
          variant="top"
          src={mediaUrl + "/image/" + stream.imagePath}
          onLoad={(e) => {
            setLoaded(true);
            e.target.style.height = "169px";
          }}
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <Card.Body className="text-start">
        <div className="d-flex align-items-center">
          <i className="userIcon bi bi-person-circle"></i>
          <div>
            <Card.Title className="textStream">{stream.title}</Card.Title>
            <Card.Text className="textStream">{stream.account}</Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
