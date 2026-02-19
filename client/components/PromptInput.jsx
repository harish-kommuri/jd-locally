import React from "react";

const PromptInput = ({
    onSubmit = () => {},
    disabled = false
}) => {
    const [input, setInput] = React.useState("");

    const handleSend = async () => {
        onSubmit(input);
    };

    return (
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
                        disabled={!input || disabled}
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
    );
}

export default PromptInput;
