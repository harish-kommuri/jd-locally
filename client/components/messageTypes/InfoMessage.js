export default function InfoMessage({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div className="mt-1">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">{data.name}</p>
        <p className="mt-1 text-xs text-slate-500">{data.address}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>⭐ {data.ratings}</span>
          <span>{data.reviews} reviews</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-[#0076d7]">Est. {data.established_on}</span>
          <span className="text-slate-500">{data.distance} away</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Price: {data.price}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`tel:${data.call}`}
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
          <a
            href={data.map_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-[#fe4200] px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-[#e33b00]"
          >
            View on Maps
          </a>
        </div>
      </div>
    </div>
  );
}
