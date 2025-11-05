import { createContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage immediately
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Login helper
    const login = (data) => {
        const { token, user } = data; // extract user and token
        setUser(user);               // only store user
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    // Logout helper
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
