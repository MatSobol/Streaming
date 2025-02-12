import { Stream } from "./Stream";

export const StreamList = ({ streamsFiltered }) => {
  return (
    <div
      className="mt-3 d-flex flex-wrap justify-content-center gap-3 ps-3 pe-3"
      style={{ maxWidth: "1606px", width: "100%" }}
    >
      {streamsFiltered.map((el, idx) => {
        return <Stream stream={el} key={idx} />;
      })}
    </div>
  );
};
