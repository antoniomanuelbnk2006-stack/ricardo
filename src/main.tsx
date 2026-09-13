import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./components/desktop/desktop.css";
import "./components/taskbar/taskbar.css";
import "./components/windows/windows.css";
import "./components/terminal/terminal.css";
import "./components/protocol/protocol.css";
import "./components/files/files.css";
import "./components/recycle/recycle.css";
import "./components/config/config.css";
import "./components/effects/effects.css";
import "./protocols/protocol01/protocol01.css";
import "./protocols/protocol02/protocol02.css";
import "./protocols/protocol03/protocol03.css";
import "./protocols/protocol04/protocol04.css";
import "./protocols/protocol05/protocol05.css";
import "./protocols/protocol00/protocol00.css";
import "./components/identity/identity.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
