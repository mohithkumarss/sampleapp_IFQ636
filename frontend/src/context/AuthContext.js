import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize state with a "Safety First" approach
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      // If the data is missing or corrupted by "undefined", return null
      if (!savedUser || savedUser === "undefined" || savedUser === "null") {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      // If JSON.parse fails, clear the mess and start fresh
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  /**
   * @desc    Updates global user state and saves token/user to localStorage
   * @param   {Object} userData - The user object from the backend
   * @param   {String} token - The JWT token from the backend
   */
  const login = (userData, token) => {
    if (!userData || !token) {
      console.error("Login failed: Missing user data or token.");
      return;
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  /**
   * @desc    Clears global state and removes all session data from the browser
   */
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

// Custom hook to use the Auth context easily in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
