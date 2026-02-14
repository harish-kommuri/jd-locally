export default function ConfirmationMessage({ message, onSelect }) {
  if (!message) {
    return null;
  }

  return (
    <div className="mt-1 space-y-3">
      <p className="text-sm text-slate-900">{message}</p>
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-[#fe4200] px-4 py-2 text-xs font-semibold text-[#fe4200] transition hover:bg-[#fe4200]/10"
        onClick={onSelect}
      >
        Select Exact Businesses
      </button>
    </div>
  );
}
