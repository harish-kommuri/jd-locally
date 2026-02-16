export default function MediaMessage() {
  const tiles = [
    {
      id: "m1",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
      isVideo: true
    },
    {
      id: "m2",
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "m3",
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "m4",
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "m5",
      url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80",
      overlay: "+140 more"
    }
  ];

  return (
    <div className="mt-1 grid grid-cols-5 gap-2">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="relative aspect-square overflow-hidden rounded-xl"
        >
          <img
            src={tile.url}
            alt="Media tile"
            className="h-full w-full object-cover"
          />
          {tile.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0076d7]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          {tile.overlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-xs font-semibold text-white">
                {tile.overlay}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
