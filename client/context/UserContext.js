"use client";

import { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext(null);

const defaultUser = {
  id: "user-001",
  name: "Harish",
  chats: [
    { id: "chat-1", title: "Best biryani spots near me", date: "Feb 14" },
    { id: "chat-2", title: "Top-rated gyms with trainers", date: "Feb 12" },
    { id: "chat-3", title: "Late-night pharmacies open now", date: "Feb 10" },
    { id: "chat-4", title: "Affordable coworking spaces", date: "Feb 08" },
    { id: "chat-5", title: "Weekend farmer markets", date: "Feb 05" }
  ]
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
