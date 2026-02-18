"use client";

import { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext(null);

const defaultUser = {
  id: "demo-user",
  name: "Harish",
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultUser);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
