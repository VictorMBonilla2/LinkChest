import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../common/Styles.css"
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import Unauthorized from "./Unauthorized";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider mode="web">
    <HashRouter>
      <Routes>
         <Route path="/" element={ 
          <ProtectedRoute>
            <App />
          </ProtectedRoute>}/> 
        <Route path="/unauthorized" element={ <Unauthorized/>}/>
      </Routes>
    </HashRouter>
  </AuthProvider>
);
