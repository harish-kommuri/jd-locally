"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import AskLocationMessage from "../components/messageTypes/AskLocationMessage";
import CompareMessage from "../components/messageTypes/CompareMessage";
import ConfirmationMessage from "../components/messageTypes/ConfirmationMessage";
import GeoLocateMessage from "../components/messageTypes/GeoLocateMessage";
import InfoMessage from "../components/messageTypes/InfoMessage";
import ListMessage from "../components/messageTypes/ListMessage";
import MediaMessage from "../components/messageTypes/MediaMessage";
import TextMessage from "../components/messageTypes/TextMessage";
import UpdateMessage from "../components/messageTypes/UpdateMessage";

import Xhr from "../utils/xhr";
import PromptInput from "./PromptInput";
import { setChatMessages } from "../store/slices/chatsSlice";

const ConfirmationModal = dynamic(
    () => import("../components/ConfirmationModal"),
    { ssr: false }
);

const formatPayload = (message) => {
    if (message.content) {
        return message.content;
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

const confirmationBusinesses = [];

const LocallyChatArea = ({
    chatId,
    onPrompted = () => {},
    isSending = false
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const messages = useSelector((state) =>
        chatId ? state.chats.messagesByChatId[chatId] ?? [] : []
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBusinesses, setSelectedBusinesses] = useState([]);

    useEffect(() => {
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
            dispatch(setChatMessages({ chatId, messages: data.messages }));
        };

        if (chatId) {
            loadChat();
        }
    }, [chatId, dispatch, router]);

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

    return (
        <>
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
                                            <UpdateMessage message={message.content} />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isUser
                                                ? "bg-[#0076d7] text-white"
                                                : "border border-[#0076d7]/20 bg-white text-slate-900"
                                                }`}
                                        >
                                            {message.type && (
                                                <p
                                                    className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${isUser ? "text-white/70" : "text-[#0076d7]"
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
                                                    message={message.data?.[0]?.content}
                                                    onSelect={() => setIsModalOpen(true)}
                                                />
                                            )}
                                            {message.type === "media" && <MediaMessage />}
                                            {message.type === "ask_location" && (
                                                <AskLocationMessage message={message.content} />
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
                <PromptInput disabled={isSending} onSubmit={onPrompted} />
            </main>
            <ConfirmationModal
                isOpen={isModalOpen}
                businesses={confirmationBusinesses}
                selectedBusinesses={selectedBusinesses}
                onToggle={toggleBusiness}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

export default LocallyChatArea;
