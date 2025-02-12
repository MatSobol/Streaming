import { useEffect, useState } from "react";
import "./browse.css";
import axios from "axios";
import { SearchInput } from "./searchInput/SearchInput";
import { useAuthHeader } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { successAlert, failAlert } from "@/store/slices/alertSlice";
import { StreamList } from "./streamList";

export const Browse = () => {
  const auth = useAuthHeader();
  const [streams, setStreams] = useState([]);
  const [streamsFiltered, setStreamsFiltered] = useState([]);
  const dispatch = useDispatch();

  const streamUrl =
    import.meta.env.VITE_SERVER_URL +
    import.meta.env.VITE_REST_API_PORT +
    import.meta.env.VITE_STREAM_ENDPOINT;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(streamUrl, {
          headers: {
            authorization: auth(),
          },
        });
        setStreamsFiltered(response.data.Streams)
        setStreams(response.data.Streams);
      } catch (e) {
        if (e?.response?.data) {
          dispatch(failAlert(e.response.data.Response));
        } else {
          dispatch(failAlert("Problem with server"));
        }
      }
    };
    getData();
    return () => setStreams([]);
  }, []);
  return (
    <div className="d-flex flex-column align-items-center">
      <SearchInput streams={streams} setStreamsFiltered={setStreamsFiltered} />
      <StreamList streamsFiltered={streamsFiltered} />
    </div>
  );
};
