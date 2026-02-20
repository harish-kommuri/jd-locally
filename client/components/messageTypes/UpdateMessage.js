export default function UpdateMessage({ message }) {
  const text = message || "Thinking";

  return (
    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#0076d7]">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#0076d7]/30 border-t-[#0076d7]" />
      <span>{text}</span>
    </div>
  );
}
