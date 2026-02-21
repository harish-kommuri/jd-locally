"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import LocallySidebar from "../../../components/LocallySidebar";
import NewChat from "../../../components/NewChat";
import LocallyChatArea from "../../../components/LocallyChatArea";
import { useDispatch, useSelector } from "react-redux";
import { addChatMessage, setTaskInProgress, incrementChatListVersion } from "../../../store/slices/chatsSlice";
import Xhr from "../../../utils/xhr";
import { userSelector } from "../../../store/selectors";

export default function LocallyChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const user = useSelector(userSelector());

  const sendPrompt = async (message = '') => {
    try {
      if (!message?.trim().length) { return; }

      setIsLoading(true);

      await streamEvents("/chat/message", {
        chat_id: chatId,
        user_id: user?.id,
        message
      });

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

          console.log(event);

          if (event.data?.type === 'update') {
            dispatch(setTaskInProgress(event));
          } else {
            dispatch(setTaskInProgress({ chatId: event.chat_id, data: {} }));

            if (event['new_chat'] === true) {
              dispatch(incrementChatListVersion());
              router.push("/locally/" + event.chat_id);
            } else {
              dispatch(
                addChatMessage({
                  chatId: event.chat_id,
                  message: {
                    ...event,
                    id: event.id || `evt-${Date.now()}-${Math.random()}`
                  }
                })
              );
            }
          }
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
        <LocallyChatArea chatId={chatId} isSending={isLoading} onPrompted={sendPrompt} />
      )}
    </section>
  );
}
