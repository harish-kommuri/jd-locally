"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Xhr from "../utils/xhr";

export default function LocallyChatArea() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createChat = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await Xhr.post("/chat/create", {
        user_id: "demo-user",
        message: query
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      router.push(`/locally/${data.chat_id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full items-center justify-center px-6 py-10 sm:px-10 bg-[radial-gradient(circle_at_top,rgba(0,118,215,0.08),transparent_60%)]">
      <div className="max-w-[520px] w-full text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Locally</h2>
        <p className="mt-3 text-sm text-slate-500">
          Start a conversation to see messages here.
        </p>
        <div className="mt-8 flex w-full items-center gap-2 rounded-full border border-[#0076d7]/30 bg-white px-4 py-2 shadow-sm">
          <input
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            placeholder="Search businesses"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0076d7] transition hover:bg-[#0076d7]/10"
            type="button"
            aria-label="Voice search"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
              <path d="M9 21h6" />
            </svg>
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0076d7] transition hover:bg-[#0076d7]/10 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            aria-label="Search"
            onClick={createChat}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12l14-7-7 14-2.5-6z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
