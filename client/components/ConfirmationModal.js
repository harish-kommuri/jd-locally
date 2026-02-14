"use client";

export default function ConfirmationModal({
  isOpen,
  businesses,
  selectedBusinesses,
  onToggle,
  onClose
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Select businesses</h3>
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Select up to 5 businesses.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {businesses.map((business) => {
            const checked = selectedBusinesses.includes(business.id);

            return (
              <label
                key={business.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                  checked
                    ? "border-[#0076d7] bg-[#0076d7]/10"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0076d7] focus:ring-[#0076d7]"
                  checked={checked}
                  onChange={() => onToggle(business.id)}
                  disabled={!checked && selectedBusinesses.length >= 5}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {business.name}
                  </p>
                  <p className="text-xs text-slate-500">{business.location}</p>
                </div>
              </label>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-[#0076d7] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0066bb]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
