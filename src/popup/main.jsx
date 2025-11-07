import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import "../common/Styles.css"
import Search from "./Search";
import AddPage from "./AddPage";
import Login from "./Login";
import { AuthProvider } from "@/context/AuthContext.jsx";
import ProtectedRoute from "@/context/ProtectedRoute.jsx";
import { SearchProvider } from "@/context/SearchContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <HashRouter>
      <Routes>

        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchProvider>
              <Search/>
            </SearchProvider>
          </ProtectedRoute>
          } 
          />
        <Route path="/addpage" element={
          <ProtectedRoute>
          <AddPage />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
          <AddPage />
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  </AuthProvider>
);
