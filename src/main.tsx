import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import App from "./App";                     // Your dashboard component
import LoginPage from "@/loginflow/LoginPage";  // Your login page component
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard route */}
        <Route
          path="/app"
          element={
            localStorage.getItem("authToken") ? (
              <App />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect root and unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
