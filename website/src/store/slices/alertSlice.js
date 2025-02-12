import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  isSuccessful: false,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    successAlert: (state, action) => {
      state.isSuccessful = true;
      state.text = action.payload;
    },
    failAlert: (state, action) => {
      state.isSuccessful = false;
      state.text = action.payload;
    },
    hide: (state) => {
      state.text = "";
    },
  },
});

export const { successAlert, failAlert, hide } = alertSlice.actions;

export default alertSlice.reducer;
