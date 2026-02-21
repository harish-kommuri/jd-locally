"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LocallyChatArea from "./LocallyChatArea";
import LocallySidebar from "./LocallySidebar";
import LoginModal from "./LoginModal";
import { getCookie } from "../utils/cookies";
import { setUser } from "../store/slices/userSlice";

export default function LocallyView() {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if userprofile cookie exists
    const userProfileCookie = getCookie("userprofile");
    if (userProfileCookie) {
      try {
        const userProfile = JSON.parse(userProfileCookie);
        setIsAuthenticated(true);
        dispatch(setUser(userProfile));
      } catch (e) {
        // Invalid cookie, ignore
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Show loading state while checking cookie
  if (isLoading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </section>
    );
  }

  return (
    <>
      {/* Login Modal - shown when not authenticated */}
      <LoginModal
        isOpen={!isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Main Content - shown when authenticated */}
      {isAuthenticated && (
        <section className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-[320px_1fr]">
          <LocallySidebar />
          <LocallyChatArea />
        </section>
      )}
    </>
  );
}
