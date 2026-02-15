export function getGeographicalData({ city, country, lat, lng }) {
  return {
    query: { city, country, lat, lng },
    timezone: "Asia/Kolkata",
    coordinates: {
      lat: lat ?? 12.9716,
      lng: lng ?? 77.5946
    },
    region: city && country ? `${city}, ${country}` : "Bengaluru, India"
  };
}
