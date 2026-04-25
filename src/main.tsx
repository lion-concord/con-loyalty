import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LkApp from "./LkApp";

const isCrypto = import.meta.env.VITE_ENABLE_CRYPTO === "true";
const RootApp = isCrypto ? App : LkApp;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
