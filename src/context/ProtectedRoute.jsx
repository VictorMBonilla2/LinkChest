import React ,{} from "react"
import { Navigate } from "react-router-dom";
import { UseAuth } from "./AuthContext";



const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, mode } = UseAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // 👇 cambia el comportamiento según el modo
    if (mode === "web") {
      return <Navigate to="/unauthorized" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;