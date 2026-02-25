// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Tenta carregar user do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (data) => {
    const payload = data?.data || data;
    const nextUser = payload?.user || null;
    const accessToken = payload?.accessToken;
    const refreshToken = payload?.refreshToken;

    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    }
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};