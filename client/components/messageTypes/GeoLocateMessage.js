export default function GeoLocateMessage({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div className="mt-1 space-y-3">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <address className="not-italic text-sm text-slate-900">
          {data.address}
        </address>
        <p className="mt-2 text-xs text-slate-500">{data.msg}</p>
      </div>
      <a
        className="inline-flex items-center rounded-full bg-[#fe4200] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#e33b00]"
        href={data.map_link}
        target="_blank"
        rel="noreferrer"
      >
        View on Maps
      </a>
    </div>
  );
}
