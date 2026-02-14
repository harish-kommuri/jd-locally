export default function ListMessage({ items }) {
  if (!Array.isArray(items)) {
    return null;
  }

  return (
    <div className="-mx-2 mt-1">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[220px] snap-start rounded-xl border border-[#0076d7]/20 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
            <p className="mt-1 text-xs text-slate-500">{item.address}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>⭐ {item.ratings}</span>
              <span>{item.reviews} reviews</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#0076d7]">Est. {item.established_on}</span>
              <span className="text-slate-500">{item.distance} away</span>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={`tel:${item.call}`}
                className="inline-flex items-center rounded-full bg-[#0076d7] px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-[#0066bb]"
              >
                Call
              </a>
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-[#fe4200] px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-[#e33b00]"
              >
                Deals
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
