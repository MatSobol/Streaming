import { InputGroup, Form } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import "./searchInput.css";

import { Suggestions } from "./suggestions/Suggestions";

export const SearchInput = ({ streams, setStreamsFiltered }) => {
  const [searchVal, setSearchVal] = useState("");
  const [suggestions, setSuggestions] = useState(
    JSON.parse(localStorage.getItem("suggestions")) || []
  );
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("suggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const filterStreams = (searchValue) => {
    if (searchValue === "") {
      setStreamsFiltered([...streams]);
      return;
    }
    setStreamsFiltered([...streams.filter((el) => el.title === searchValue)]);
  };

  const search = (searchedTitle) => {
    console.log(searchedTitle)
    const copy = suggestions;
    copy.unshift(searchedTitle);
    copy.length = copy.length < 40 ? copy.length : 40;
    setSuggestions([...copy]);
    filterStreams(searchedTitle);
    setSearchVal(searchedTitle);
  };

  const clear = () => {
    setSearchVal("");
    searchInputRef.current.focus();
  };

  const clickedKey = (e) => {
    if (e.key === "Enter") {
      search(searchVal);
    }
  };

  return (
    <div
      className="position-relative mt-3"
      onClick={() => setShowSuggestions(true)}
      ref={containerRef}
    >
      <InputGroup className="searchInput">
        <Form.Control
          onKeyDown={(e) => clickedKey(e)}
          ref={searchInputRef}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <i
          className="bi bi-x close"
          style={{ display: searchVal.length > 0 ? "flex" : "none" }}
          onClick={() => clear()}
        ></i>
        <InputGroup.Text onClick={() => search(searchVal)}>
          <i className="bi bi-search searchIcon"></i>
        </InputGroup.Text>
      </InputGroup>
      {showSuggestions && (
        <Suggestions
          search={search}
          searchVal={searchVal}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
      )}
    </div>
  );
};
