"use client";

import { useParams } from "next/navigation";
import LocallySidebar from "../../../components/LocallySidebar";
import NewChat from "../../../components/NewChat";
import LocallyChatArea from "../../../components/LocallyChatArea";

export default function LocallyChatPage() {
  const params = useParams();
  const chatId = params?.chatId;

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
