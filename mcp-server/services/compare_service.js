const sampleBusinesses = [
  {
    id: "b1",
    name: "Spice Avenue",
    category: "restaurants",
    rating: 4.6,
    price_level: 2,
    distance_km: 1.2,
    amenities: ["WiFi", "Parking"],
    address: "Hitech City, Hyderabad"
  },
  {
    id: "b2",
    name: "Urban Dine",
    category: "restaurants",
    rating: 4.4,
    price_level: 1,
    distance_km: 2.4,
    amenities: ["Outdoor Seating"],
    address: "Kondapur, Hyderabad"
  },
  {
    id: "b3",
    name: "Bistro 27",
    category: "restaurants",
    rating: 4.7,
    price_level: 3,
    distance_km: 3.1,
    amenities: ["WiFi", "Live Music"],
    address: "Gachibowli, Hyderabad"
  }
];

const businessById = (id) => sampleBusinesses.find((item) => item.id === id);

export function compareBusinesses({ business_ids = [] }) {
  const items = business_ids.map((id) => businessById(id)).filter(Boolean);

  return {
    count: items.length,
    items
  };
}
