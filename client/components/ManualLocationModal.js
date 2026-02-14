"use client";

export default function ManualLocationModal({
  isOpen,
  searchValue,
  suggestions,
  selectedLocation,
  topCities,
  onClose,
  onSearchChange,
  onSuggestionSelect,
  onCitySelect,
  onConfirm
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Select location</h3>
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-4">
          <input
            value={searchValue}
            onChange={onSearchChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0076d7]/30"
            placeholder="Type a city or area"
            type="text"
          />
          {suggestions.length > 0 && (
            <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2">
              {suggestions.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => onSuggestionSelect(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Top cities in India
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {topCities.map((city) => (
              <button
                key={city}
                type="button"
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  selectedLocation === city
                    ? "border-[#0076d7] bg-[#0076d7]/10 text-[#0076d7]"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => onCitySelect(city)}
              >
                {city}
              </button>
            ))}
          </div>
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
            onClick={onConfirm}
          >
            Use location
          </button>
        </div>
      </div>
    </div>
  );
}
