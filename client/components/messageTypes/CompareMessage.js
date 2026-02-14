export default function CompareMessage({ items }) {
  if (!Array.isArray(items)) {
    return null;
  }

  const rows = [
    { key: "ratings", label: "Ratings" },
    { key: "reviews", label: "Reviews" },
    { key: "price", label: "Price" },
    { key: "distance", label: "Distance" },
    { key: "established_on", label: "Established" },
    { key: "address", label: "Address" }
  ];

  return (
    <div className="mt-1 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-xs text-slate-700">
        <thead>
          <tr>
            <th className="border-b border-[#0076d7]/20 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#0076d7]">
              Details
            </th>
            {items.slice(0, 5).map((item) => (
              <th
                key={item.id}
                className="border-b border-[#0076d7]/20 px-3 py-2 text-sm font-semibold text-slate-900"
              >
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-100">
              <td className="px-3 py-2 text-slate-500">{row.label}</td>
              {items.slice(0, 5).map((item) => (
                <td key={item.id} className="px-3 py-2 text-slate-900">
                  {item[row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
