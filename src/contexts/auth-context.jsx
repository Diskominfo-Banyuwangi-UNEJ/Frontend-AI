// src/contexts/auth-context.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("isAuthenticated") === "true";
        console.log("Saved Auth Status: ", saved);
        setIsAuthenticated(saved);
        setIsLoading(false);
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext({
//     isAuthenticated: false,
//     login: () => {},
//     logout: () => {},
// });

// export function AuthProvider({ children }) {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const saved = localStorage.getItem("isAuthenticated") === "true";
    //     console.log("Saved Auth Status: ", saved);
    //     setIsAuthenticated(saved);
    //     setIsLoading(false);
    // }, []);

    // const login = () => {
    //     setIsAuthenticated(true);
    //     localStorage.setItem("isAuthenticated", "true");
    // };

    // const logout = () => {
    //     setIsAuthenticated(false);
    //     localStorage.removeItem("isAuthenticated");
    // };

    // Return a simplified context, without authentication handling
//     return (
//         <AuthContext.Provider value={{ isAuthenticated: true, isLoading: false, login: () => {}, logout: () => {} }}>{children}</AuthContext.Provider>
//     );
// }
