import { Card, CardBody } from "react-bootstrap";
import "./namedCard.css"

export const NamedCard = ({ name, children }) => {
  return (
    <Card className="mb-3">
      <div className="cardData">{name}</div>
      <CardBody>{children}</CardBody>
    </Card>
  );
};
