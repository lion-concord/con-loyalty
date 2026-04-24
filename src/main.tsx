import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LkRouter from "./app/router";
import AppProviders from "./app/providers";

const uiMode = import.meta.env.VITE_UI_MODE ?? "classic";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {uiMode === "lk" ? (
      <AppProviders>
        <LkRouter konBalance={1240} />
      </AppProviders>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
