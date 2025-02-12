import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "react-auth-kit";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { store } from "./store/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider
    authType={"cookie"}
    authName={"_auth"}
    cookieDomain={window.location.hostname}
    cookieSecure={false}
  >
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_KEY}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </AuthProvider>
);
