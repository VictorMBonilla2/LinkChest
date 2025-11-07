import { validarSesion } from "@/services/Users";
import React, { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children, mode = "popup"  }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // 👈 Aquí guardas el usuario completo

  useEffect(() => {
    const checkSesion = async () => {
      try {
        const userData = await validarSesion(); // ← Devuelve info del usuario, no solo booleano
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkSesion();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const isAdmin = user?.rol === "addm";

  const logout = () => {
    document.cookie = "jwtAuth=; max-age=0; path=/";
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, isAdmin,login, logout,mode}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);
