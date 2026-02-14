export default function ConfirmationMessage({ message, onSelect }) {
  if (!message) {
    return null;
  }

  return (
    <div className="mt-1 space-y-3">
      <p className="text-sm text-slate-900">{message}</p>
      <button
        type="button"
        className="inline-flex items-center rounded-full bg-[#fe4200] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#e33b00]"
        onClick={onSelect}
      >
        Select Exact Businesses
      </button>
    </div>
  );
}
