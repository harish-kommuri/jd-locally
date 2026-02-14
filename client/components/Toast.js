export default function Toast({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[5px] border border-[#fe4200] bg-white px-4 py-2 text-xs font-semibold text-[#fe4200] shadow-lg">
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="text-[#fe4200] transition hover:text-[#e33b00]"
        aria-label="Close"
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
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
