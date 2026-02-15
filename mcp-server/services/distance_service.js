const toRadians = (value) => (value * Math.PI) / 180;

export function calculateDistance({ from, to }) {
  if (!from || !to) {
    return { distance_km: null };
  }

  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return { distance_km: Number((earthRadiusKm * c).toFixed(2)) };
}
