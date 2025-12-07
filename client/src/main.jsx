import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/* ✅ Router burada değil; App içinde zaten tanımlı */}
  </React.StrictMode>
);
