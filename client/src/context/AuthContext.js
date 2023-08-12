import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true" || false
  );

  const handleAuthentication = (value) => {
    setIsAuthenticated(value);
    localStorage.setItem("isAuthenticated", value);
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("isAuthenticated");
    };
  }, []);

  const value = {
    isAuthenticated,
    handleAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
