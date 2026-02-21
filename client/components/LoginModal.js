"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCookie, encodeBase64 } from "../utils/cookies";
import { setUser } from "../store/slices/userSlice";

const VALID_OTP = "2222";

export default function LoginModal({ isOpen, onLoginSuccess }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState("details"); // "details" or "otp"
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!mobile.trim() || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setStep("otp");
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simulate OTP validation delay
    setTimeout(() => {
      if (otp === VALID_OTP) {
        // Create user profile with base64 encoded mobile as id
        const encodedMobile = encodeBase64(mobile);
        const userProfile = { id: encodedMobile, name, mobile };
        
        // Set the userprofile cookie with JSON stringified object
        setCookie("userprofile", JSON.stringify(userProfile), 30);
        
        // Set user in Redux state
        dispatch(setUser(userProfile));
        
        // Call success callback with user details
        onLoginSuccess(userProfile);
      } else {
        setError("Invalid OTP. Please try again.");
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleBack = () => {
    setStep("details");
    setOtp("");
    setError("");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0076d7]/10">
            <svg
              className="h-8 w-8 text-[#0076d7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {step === "details" ? "Welcome to Locally" : "Verify OTP"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {step === "details"
              ? "Please enter your details to continue"
              : `Enter the OTP sent to ${mobile}`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Details Form */}
        {step === "details" && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0076d7] focus:ring-2 focus:ring-[#0076d7]/20"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0076d7] focus:ring-2 focus:ring-[#0076d7]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#0076d7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0066c0] active:scale-[0.99]"
            >
              Get OTP
            </button>
          </form>
        )}

        {/* OTP Form */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-lg font-semibold tracking-widest outline-none transition focus:border-[#0076d7] focus:ring-2 focus:ring-[#0076d7]/20"
                autoFocus
              />
              <p className="mt-2 text-xs text-slate-500">
                Use OTP: <span className="font-semibold">2222</span> for testing
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 4}
              className="w-full rounded-lg bg-[#0076d7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0066c0] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
