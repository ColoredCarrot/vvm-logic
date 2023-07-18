import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./view/fonts.css";

import App from "./view/App";

const root = ReactDOM.createRoot(
  document.getElementById("root")!
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
