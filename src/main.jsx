import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./fonts/index.css";
import { initializeFontLoading } from "./fonts/font-loading.js";
import App from "./App.jsx";

// // Initialize font loading optimization
// initializeFontLoading();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
