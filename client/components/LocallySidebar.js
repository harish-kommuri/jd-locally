import { useUser } from "../context/UserContext";

export default function LocallySidebar() {
  const { user } = useUser();
  const chatHistory = user?.chats ?? [];

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto bg-slate-50 border-r border-[#0076d7]/20 px-5 py-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5 text-xs uppercase tracking-[0.12em] text-slate-500">
          <span className="font-semibold">Hitech City</span>
          <span className="opacity-60">,</span>
          <span>Hyderabad</span>
          <span className="opacity-60">-</span>
          <span>500081</span>
        </div>
        <div className="h-px bg-[#0076d7]/20" />
        <button
          className="rounded-xl border border-[#0076d7]/40 bg-[#0076d7]/10 px-4 py-3 text-left font-semibold text-[#0076d7] transition hover:bg-[#0076d7]/20"
          type="button"
        >
          New chat
        </button>
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
