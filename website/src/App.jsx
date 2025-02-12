import "./css/App.css";
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useIsAuthenticated } from "react-auth-kit";

import { MyNavbar } from "./navbar/Navbar";
import { CustomAlert } from "./customAlert/customAlert";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { Home } from "./home/home";
import { Browse } from "./browse/Browse";
import { StreamSetUp } from "./stream/streamSetUp/StreamSetUp";
import { Streaming } from "./stream/streaming/Streaming";
import { Watch } from "./stream/watch/Watch";

export default function App() {
  const auth = useIsAuthenticated();
  function Protected({ children }) {
    let location = useLocation();
    return auth() ? (
      children
    ) : (
      <Navigate to="/login" state={{ from: location.pathname }} />
    );
  }
  return (
    <div className="App">
      <BrowserRouter>
        <MyNavbar />
        <CustomAlert />
        <div id="routes-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/browse"
              element={
                <Protected>
                  <Browse />
                </Protected>
              }
            />
            <Route
              path="/watch/:id"
              element={
                <Protected>
                  <Watch />
                </Protected>
              }
            />
            <Route
              path="/stream"
              element={
                <Protected>
                  <Outlet />
                </Protected>
              }
            >
              <Route path="" element={<StreamSetUp />} />
              <Route path="streaming" element={<Streaming />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
