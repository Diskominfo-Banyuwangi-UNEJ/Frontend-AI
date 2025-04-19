// src/contexts/auth-context.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("isAuthenticated") === "true";
        console.log("Saved Auth Status: ", saved); // Menambahkan log untuk memeriksa status auth
        setIsAuthenticated(saved);
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}
