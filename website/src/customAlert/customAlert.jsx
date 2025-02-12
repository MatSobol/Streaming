import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { hide } from "@/store/slices/alertSlice";

export const CustomAlert = () => {
  const dispatch = useDispatch();
  const { isSuccessful, text } = useSelector((state) => state.alert);
  const closeAlert = () => {
    dispatch(hide());
    document.removeEventListener("mousedown", closeAlert);
  };

  useEffect(() => {
    if (text) {
      document.addEventListener("mousedown", closeAlert);
      var timeout = null;
      timeout = setTimeout(() => {
        closeAlert();
      }, 2500);
    }
    return () => {
      document.removeEventListener("mousedown", closeAlert);
      clearTimeout(timeout);
    };
  }, [text]);

  return (
    <div
      className="w-100 pt-3 position-fixed d-flex justify-content-center"
      style={{ zIndex: "2" }}
    >
      <Alert
        show={text ? true : false}
        className="w-50"
        variant={isSuccessful ? "success" : "danger"}
        dismissible
      >
        {text}
      </Alert>
    </div>
  );
};
