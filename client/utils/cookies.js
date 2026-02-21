"use client";

/**
 * Encode a string to base64
 */
export function encodeBase64(str) {
  if (typeof window !== "undefined") {
    return btoa(str);
  }
  return Buffer.from(str).toString("base64");
}

/**
 * Decode a base64 string
 */
export function decodeBase64(str) {
  if (typeof window !== "undefined") {
    return atob(str);
  }
  return Buffer.from(str, "base64").toString("utf-8");
}

/**
 * Set a cookie with the given name, value, and expiration days
 */
export function setCookie(name, value, days = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}
