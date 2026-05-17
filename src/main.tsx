import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./app/App";
import "./styles/index.css";

// StrictMode catches common side-effect issues early in development.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
