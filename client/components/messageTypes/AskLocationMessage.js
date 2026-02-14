import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Toast from "../Toast";

const ManualLocationModal = dynamic(() => import("../ManualLocationModal"), {
  ssr: false
});

const TOP_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow"
];

export default function AskLocationMessage({ message }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [toast, setToast] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) {
      return [];
    }

    const query = searchValue.toLowerCase();
    return TOP_CITIES.filter((city) => city.toLowerCase().includes(query));
  }, [searchValue]);

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 3000);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        showToast("Unable to detect location. Please try again.");
      }
    );
  };
  if (!message) {
    return null;
  }

  return (
    <div className="mt-1 space-y-3">
      <p className="text-sm text-slate-900">{message}</p>
      {coordinates && (
        <p className="text-xs text-slate-500">
          Detected: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[#0076d7] px-4 py-2 text-xs font-semibold text-[#0076d7] transition hover:bg-[#0076d7]/10"
          onClick={handleDetectLocation}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M4.22 4.22l2.12 2.12" />
            <path d="M17.66 17.66l2.12 2.12" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
            <path d="M4.22 19.78l2.12-2.12" />
            <path d="M17.66 6.34l2.12-2.12" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          Detect location
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-[#0076d7] px-4 py-2 text-xs font-semibold text-[#0076d7] transition hover:bg-[#0076d7]/10"
          onClick={() => setIsModalOpen(true)}
        >
          Enter manually
        </button>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
      <ManualLocationModal
        isOpen={isModalOpen}
        searchValue={searchValue}
        suggestions={suggestions}
        selectedLocation={selectedLocation}
        topCities={TOP_CITIES}
        onClose={() => setIsModalOpen(false)}
        onSearchChange={(event) => setSearchValue(event.target.value)}
        onSuggestionSelect={(city) => {
          setSelectedLocation(city);
          setSearchValue(city);
        }}
        onCitySelect={(city) => setSelectedLocation(city)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </div>
  );
}
