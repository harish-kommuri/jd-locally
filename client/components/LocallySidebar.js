"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useSelector } from "react-redux";
import Xhr from "../utils/xhr";

export default function LocallySidebar() {
  const user = useSelector((state) => state.user.user);
  const chatListVersion = useSelector((state) => state.chats.chatListVersion);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  useEffect(() => {
    if (!user?.id) {
      setChatHistory([]);
      return;
    }

    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await Xhr.get(`/chat/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.chats ?? []);
        }
      } catch {
        // ignore errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user?.id, chatListVersion]);

  return (
    <aside className="sticky max-w-[340px] top-0 h-screen overflow-y-auto bg-slate-50 border-r border-[#0076d7]/20 px-5 py-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0076d7]/10 text-sm font-semibold text-[#0076d7]">
              {initials}
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-slate-400"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            {user ? (
              <>
                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.id}</span>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-[#0076d7] transition hover:text-[#0066bb]"
              >
                Login to continue
              </Link>
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
      {user ? (
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            History
          </p>
          {isLoading ? (
            <p className="text-xs text-slate-400 px-1">Loading...</p>
          ) : chatHistory.length === 0 ? (
            <p className="text-xs text-slate-400 px-1">No chats yet</p>
          ) : (
            <ul className="m-0 p-0 list-none flex flex-col gap-1">
              {chatHistory.map((chat) => (
                <li key={chat.id}>
                  <Link
                    href={`/locally/${chat.id}`}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-700 transition hover:bg-[#0076d7]/10 hover:text-[#0076d7]"
                  >
                    <span className="truncate">{chat.chat_name || chat.title}</span>
                    {chat.date && (
                      <span className="ml-2 shrink-0 text-xs text-slate-400">{chat.date}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-xs text-slate-400 px-1">
            Login to view your chat history
          </p>
        </div>
      )}
    </aside>
  );
}
