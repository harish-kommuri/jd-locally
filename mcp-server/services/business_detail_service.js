const sampleDetails = {
  quick_info: {
    name: "Spice Avenue",
    address: "Hitech City, Hyderabad",
    phone: "+91 90000 10001",
    rating: 4.6
  },
  services: ["Dine-in", "Takeaway", "Delivery"],
  reviews: [
    { user: "Asha", rating: 5, comment: "Great food and ambience." },
    { user: "Vikram", rating: 4, comment: "Quick service." }
  ],
  similar: ["Urban Dine", "Bistro 27"],
  amenities: ["WiFi", "Parking", "Family seating"],
  highlights: ["Chef specials", "Weekend live music"],
  insights: {
    peak_hours: "7pm - 9pm",
    avg_cost_for_two: "₹1200"
  },
  doctors: [
    { name: "Dr. Rao", specialization: "Cardiology" },
    { name: "Dr. Mehta", specialization: "Orthopedics" }
  ],
  offers: ["10% off on weekdays", "Free dessert with main course"],
  stores: [
    { name: "Spice Avenue - Kondapur", address: "Kondapur, Hyderabad" },
    { name: "Spice Avenue - Gachibowli", address: "Gachibowli, Hyderabad" }
  ],
  reels: [
    { title: "Signature Dish", url: "https://example.com/reel/1" },
    { title: "Kitchen Tour", url: "https://example.com/reel/2" }
  ],
  menu: [
    { item: "Paneer Tikka", price: "₹320" },
    { item: "Biryani", price: "₹420" }
  ],
  catalogues: [
    { title: "Wedding Catering", url: "https://example.com/catalogue/1" }
  ],
  fees: {
    tuition: "₹75,000/year",
    admission: "₹10,000"
  }
};

export function getBusinessDetail({ type, business_id }) {
  return {
    business_id,
    type,
    data: sampleDetails[type] ?? null
  };
}
