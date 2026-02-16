"use client";

import Link from "next/link";

import { useUser } from "../context/UserContext";

export default function LocallySidebar() {
  const { user } = useUser();
  const chatHistory = user?.chats ?? [];
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto bg-slate-50 border-r border-[#0076d7]/20 px-5 py-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0076d7]/10 text-sm font-semibold text-[#0076d7]">
              {initials}
            </div>
          ) : (
            <img
              src="https://via.placeholder.com/40"
              alt="User placeholder"
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            {user ? (
              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-[#0076d7] transition hover:text-[#0066bb]"
              >
                Login
              </Link>
            )}
            {user && (
              <span className="text-xs text-slate-500">{user.id}</span>
            )}
          </div>
        </div>
        <div className="h-px bg-[#0076d7]/20" />
        <div className="flex flex-col gap-1 text-xs uppercase tracking-[0.12em] text-slate-500">
          <div className="flex flex-wrap gap-1.5">
            <span className="font-semibold">Hitech City</span>
          </div>
          <div className="flex flex-wrap gap-1.5 opacity-60">
            <span>Hyderabad</span>
            <span className="">-</span>
            <span>500081</span>
          </div>
        </div>
        <div className="h-px bg-[#0076d7]/20" />
        <Link
          href="/locally/new"
          className="flex items-center gap-2 px-1 text-sm font-semibold text-[#0076d7] transition hover:text-[#0066bb]"
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          New chat
        </Link>
        <div className="h-px bg-[#0076d7]/20" />
      </div>
      {user && (
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            History
          </p>
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {chatHistory.map((chat) => (
              <li key={chat.id} className="relative flex flex-col gap-1 px-1 py-2">
                <span className="truncate text-sm font-semibold text-slate-900">
                  {chat.title}
                </span>
                <span className="text-right text-xs text-slate-500">{chat.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
