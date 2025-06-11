// // src/contexts/auth-context.jsx
// import React, { createContext, useState,useContext, useEffect } from "react";
// import Cookies from "js-cookie";

// export const AuthContext = createContext({
//     isAuthenticated: false,
//     login: () => {},
//     logout: () => {},
// });

// export function AuthProvider({ children }) {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const saved = localStorage.getItem("isAuthenticated") === "true";
//         console.log("Saved Auth Status: ", saved);
//         setIsAuthenticated(saved);
//         setIsLoading(false);
//     }, []);

//     const login = () => {
//         setIsAuthenticated(true);
//         localStorage.setItem("isAuthenticated", "true");
//     };

//     const logout = () => {
//         setIsAuthenticated(false);
//         localStorage.removeItem("isAuthenticated");
//     };

//     return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>;
// }
// export function useAuth() {
//     return useContext(AuthContext);
// }

// export const getAuthToken = () => {
//   return Cookies.get('authToken');
// };

// export const isAuthenticated = () => {
//   return !!getAuthToken();
// };

import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

// Buat konteks dengan default
export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  login: (role) => {},
  logout: () => {},
});

// Provider
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated") === "true";
    const savedRole = localStorage.getItem("userRole");

    setIsAuthenticated(savedAuth);
    setUserRole(savedRole);
    setIsLoading(false);
  }, []);

  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook untuk akses AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Token getter
export const getAuthToken = () => {
  return Cookies.get("authToken");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
