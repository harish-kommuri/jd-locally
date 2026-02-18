"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import LocallySidebar from "../../../components/LocallySidebar";
import AskLocationMessage from "../../../components/messageTypes/AskLocationMessage";
import CompareMessage from "../../../components/messageTypes/CompareMessage";
import ConfirmationMessage from "../../../components/messageTypes/ConfirmationMessage";
import GeoLocateMessage from "../../../components/messageTypes/GeoLocateMessage";
import InfoMessage from "../../../components/messageTypes/InfoMessage";
import ListMessage from "../../../components/messageTypes/ListMessage";
import MediaMessage from "../../../components/messageTypes/MediaMessage";
import TextMessage from "../../../components/messageTypes/TextMessage";
import UpdateMessage from "../../../components/messageTypes/UpdateMessage";
import Xhr from "../../../utils/xhr";

const ConfirmationModal = dynamic(
  () => import("../../../components/ConfirmationModal"),
  { ssr: false }
);

const initialMessages = [];

const formatPayload = (message) => {
  if (message.msg) {
    return message.msg;
  }

  if (message.data) {
    return JSON.stringify(message.data, null, 2);
  }

  return "";
};

const messageTitles = {
  update: "Status",
  ask_location: "Location permission",
  address: "Address",
  list: "Nearby places",
  compare: "Comparison",
  geo_locate: "Distance info",
  media: "Media",
  confirmation: "Confirmation",
  info: "Business details"
};

export default function LocallyChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = params?.chatId;
  const [messages, setMessages] = useState(initialMessages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const hasInitialized = useRef(false);


  useEffect(() => {
    if (!chatId) return;

    const loadChat = async () => {
      const response = await Xhr.get(`/chat/${chatId}`);
      if (!response.ok) {
        router.replace("/locally/new");
        return;
      }
      const data = await response.json();
      if (!data.messages || data.messages.length === 0) {
        router.replace("/locally/new");
        return;
      }
      setMessages(data.messages);
    };

    loadChat();
  }, [chatId, router]);

  const confirmationBusinesses = useMemo(() => {
    const confirmation = messages.find(
      (message) => message.type === "confirmation"
    );

    if (!confirmation || !Array.isArray(confirmation.data)) {
      return [];
    }

    return confirmation.data[0]?.list ?? [];
  }, [messages]);

  const toggleBusiness = (businessId) => {
    setSelectedBusinesses((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      }

      if (prev.length >= 5) {
        return prev;
      }

      return [...prev, businessId];
    });
  };

  const streamEvents = async (path, payload) => {
    const response = await Xhr.post(path, payload);

    if (!response.ok || !response.body) {
      throw new Error("Failed to stream chat");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";

      chunks.forEach((chunk) => {
        const line = chunk.trim();
        if (!line.startsWith("data:")) return;

        const jsonText = line.replace(/^data:\s*/, "");
        try {
          const event = JSON.parse(jsonText);
          setMessages((prev) => [
            ...prev,
            {
              ...event,
              id: event.id || `evt-${Date.now()}-${Math.random()}`
            }
          ]);
        } catch {
          // ignore parse errors
        }
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending || !chatId) return;

    setIsSending(true);

    try {
      await streamEvents("/chat/message", {
        chat_id: chatId,
        user_id: "demo-user",
        message: input
      });
    } finally {
      setIsSending(false);
      setInput("");
    }
  };

  useEffect(() => {
    if (!chatId || hasInitialized.current !== false) return;

    const shouldInit = searchParams?.get("init") === "1";
    if (!shouldInit) return;

    hasInitialized.current = true;
    setIsSending(true);

    streamEvents("/chat/respond", { chat_id: chatId })
      .catch(() => {})
      .finally(() => setIsSending(false));
  }, [chatId, searchParams]);

  return (
    <section className="min-h-screen bg-white grid grid-cols-1 grid-cols-[320px_1fr]">
      <LocallySidebar />
      <main className="flex w-full flex-col bg-[radial-gradient(circle_at_top,rgba(0,118,215,0.08),transparent_60%)] px-6 sm:px-10">
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-4 py-10">
          {messages.map((message, index) => {
            const isUser = message.role.toLowerCase() === "user";
            const payload = formatPayload(message);

            return (
              <div key={message.id + "_" + (index + 1)}>
                {message.type === "update" ? (
                  <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                      <UpdateMessage message={message.msg} />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isUser
                          ? "bg-[#0076d7] text-white"
                          : "border border-[#0076d7]/20 bg-white text-slate-900"
                      }`}
                    >
                      {message.type && (
                        <p
                          className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${
                            isUser ? "text-white/70" : "text-[#0076d7]"
                          }`}
                        >
                          {messageTitles[message.type] ?? message.type}
                        </p>
                      )}
                      {message.type === "list" && (
                        <ListMessage items={message.data} />
                      )}
                      {message.type === "compare" && (
                        <CompareMessage items={message.data} />
                      )}
                      {message.type === "geo_locate" && (
                        <GeoLocateMessage data={message.data} />
                      )}
                      {message.type === "confirmation" && (
                        <ConfirmationMessage
                          message={message.data?.[0]?.msg}
                          onSelect={() => setIsModalOpen(true)}
                        />
                      )}
                      {message.type === "media" && <MediaMessage />}
                      {message.type === "ask_location" && (
                        <AskLocationMessage message={message.msg} />
                      )}
                      {message.type === "info" && (
                        <InfoMessage data={message.data} />
                      )}
                      {(!message.type ||
                        ![
                          "list",
                          "compare",
                          "geo_locate",
                          "confirmation",
                          "update",
                          "media",
                          "ask_location",
                          "info"
                        ].includes(message.type)) &&
                        payload && <TextMessage text={payload} />}
                      {message.attachments && message.attachments.length > 0 && (
                        <p className="mt-2 text-xs text-white/70">
                          {message.attachments.length} attachment(s)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="pt-8 text-center text-sm text-slate-500">
              I can assist you with business information and comparisons. Give it a try.
            </div>
          )}
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl py-4">
            <div className="flex w-full items-center gap-2 rounded-full border border-[#0076d7]/30 bg-white px-4 py-2 shadow-sm">
              <input
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search businesses"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#0076d7] transition hover:bg-[#0076d7]/10"
                type="button"
                aria-label="Voice search"
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
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#0076d7] transition hover:bg-[#0076d7]/10"
                type="button"
                aria-label="Search"
                onClick={handleSend}
                disabled={isSending}
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
        </div>
      </main>
      <ConfirmationModal
        isOpen={isModalOpen}
        businesses={confirmationBusinesses}
        selectedBusinesses={selectedBusinesses}
        onToggle={toggleBusiness}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
