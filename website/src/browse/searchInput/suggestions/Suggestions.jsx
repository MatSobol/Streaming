import { useState } from "react";
import { Card } from "react-bootstrap";
import "./suggestions.css";
import { GoBackIcon } from "../../../modules/goBackIcon/goBackIcon";

export const Suggestions = ({
  search,
  searchVal,
  suggestions,
  setSuggestions,
}) => {
  const copy = suggestions
    .filter((item) => item.startsWith(searchVal))
    .slice(0, 5);

  if (copy.length === 0) {
    return <></>;
  }

  const removeSuggestion = async (e, el) => {
    const temp = suggestions;
    console.log(temp);
    let index = temp.indexOf(el);
    if (index !== -1) {
      temp.splice(index, 1);
    }
    setSuggestions([...temp]);
  };

  return (
    <Card className="suggestionList py-0">
      <Card.Body>
        <ul>
          {copy.map((el) => {
            return (
              <li>
                <div
                  className="flex-grow-1 d-flex align-items-center"
                  style={{ gap: "5px" }}
                  onClick={() => search(el)}
                >
                  <div style={{ marginTop: "1px" }}>
                    <GoBackIcon widthIcon={"12px"} heightIcon={"12px"} />
                  </div>
                  <div>{el}</div>
                </div>
                <i
                  class="bi bi-trash trashIcon"
                  onClick={(e) => removeSuggestion(e, el)}
                ></i>
              </li>
            );
          })}
        </ul>
      </Card.Body>
    </Card>
  );
};
