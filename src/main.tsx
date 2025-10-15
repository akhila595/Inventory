// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "@/AppRouter"; // Import the routing setup
import "./index.css"; // Global styles

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
