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
import NewChat from "../../../components/NewChat";
import LocallyChatArea from "../../../components/LocallyChatArea";

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
  // const hasInitialized = useRef(false);


  useEffect(() => {
    if (!chatId) return; c

    if (chatId === 'new') {
      setMessages([]);
      return;
    }

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

  // useEffect(() => {
  //   if (!chatId || hasInitialized.current !== false) return;

  //   const shouldInit = searchParams?.get("init") === "1";
  //   if (!shouldInit) return;

  //   hasInitialized.current = true;
  //   setIsSending(true);

  //   streamEvents("/chat/respond", { chat_id: chatId })
  //     .catch(() => {})
  //     .finally(() => setIsSending(false));
  // }, [chatId, searchParams]);

  return (
    <section className="min-h-screen bg-white grid grid-cols-1 grid-cols-[320px_1fr]">
      <LocallySidebar />
      {chatId === 'new' ? (
        <NewChat />
      ) : (
        <LocallyChatArea />
      )}
    </section>
  );
}
