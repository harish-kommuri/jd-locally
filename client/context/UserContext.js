"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie, deleteCookie, encodeBase64 } from "../utils/cookies";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const userProfileCookie = getCookie("userprofile");
    if (userProfileCookie) {
      try {
        const userProfile = JSON.parse(userProfileCookie);
        setUser(userProfile);
        setIsAuthenticated(true);
      } catch (e) {
        // Invalid cookie, ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    const userProfile = {
      id: encodeBase64(userData.mobile),
      name: userData.name,
      mobile: userData.mobile
    };
    setCookie("userprofile", JSON.stringify(userProfile), 30);
    setUser(userProfile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    deleteCookie("userprofile");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ user, setUser, isAuthenticated, isLoading, login, logout }),
    [user, isAuthenticated, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
