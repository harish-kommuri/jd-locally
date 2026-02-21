const sampleBusinesses = [
  {
    id: "b1",
    name: "Spice Avenue",
    category: "restaurants",
    rating: 4.6,
    price_level: 2,
    distance_km: 1.2
  },
  {
    id: "b2",
    name: "Urban Dine",
    category: "restaurants",
    rating: 4.4,
    price_level: 1,
    distance_km: 2.4
  },
  {
    id: "b3",
    name: "Bistro 27",
    category: "restaurants",
    rating: 4.7,
    price_level: 3,
    distance_km: 3.1
  },
  {
    id: "b4",
    name: "FitZone Gym",
    category: "gyms",
    rating: 4.3,
    price_level: 2,
    distance_km: 1.6
  },
  {
    id: "b5",
    name: "Prime Care Clinic",
    category: "hospitals",
    rating: 4.8,
    price_level: 3,
    distance_km: 4.2
  }
];

export function getCategoryResults({ category, sort_by }) {
  return sampleBusinesses;
  const filtered = category
    ? sampleBusinesses.filter((item) => item.category === category)
    : sampleBusinesses;

  const sorted = [...filtered];

  if (sort_by === "most_rated") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sort_by === "cheapest") {
    sorted.sort((a, b) => a.price_level - b.price_level);
  } else if (sort_by === "nearest") {
    sorted.sort((a, b) => a.distance_km - b.distance_km);
  }

  return sorted;
}
