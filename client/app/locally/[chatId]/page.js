"use client";

import React from "react";
import { useParams } from "next/navigation";
import LocallySidebar from "../../../components/LocallySidebar";
import NewChat from "../../../components/NewChat";
import LocallyChatArea from "../../../components/LocallyChatArea";
import { useDispatch } from "react-redux";
import { addChatMessage } from "../../../store/slices/chatsSlice";
import Xhr from "../../../utils/xhr";

export default function LocallyChatPage() {
  const params = useParams();
  const chatId = params?.chatId;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

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

  const sendPrompt = async (content = '') => {
    try {
      if (!content?.trim().length) { return; }

      setIsLoading(true);

    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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
          dispatch(
            addChatMessage({
              chatId,
              message: {
                ...event,
                id: event.id || `evt-${Date.now()}-${Math.random()}`
              }
            })
          );
        } catch {
          // ignore parse errors
        }
      });
    }
  };



  return (
    <section className="min-h-screen bg-white grid grid-cols-1 grid-cols-[320px_1fr]">
      <LocallySidebar />
      {chatId === 'new' ? (
        <NewChat
          isLoading={isLoading}
          onPrompted={sendPrompt}
        />
      ) : (
        <LocallyChatArea chatId={chatId} />
      )}
    </section>
  );
}
