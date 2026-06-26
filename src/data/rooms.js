const rooms = [
  {
    id: 1,
    name: "Deluxe Ocean Room",
    type: "deluxe",
    description: "Spacious room with breathtaking ocean views, king-sized bed, and modern amenities.",
    price: 20000,
    capacity: 2,
    size: "45 m²",
    beds: "1 King Bed",
    amenities: ["Ocean View", "Free WiFi", "Mini Bar", "Air Conditioning", "Room Service", "Flat-screen TV"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
    ],
    totalRooms: 10,
    extraBedPrice: 4000
  },
  {
    id: 2,
    name: "Premium Suite",
    type: "suite",
    description: "Luxurious suite with separate living area, panoramic views, and premium furnishings.",
    price: 35000,
    capacity: 4,
    size: "75 m²",
    beds: "1 King Bed + Sofa Bed",
    amenities: ["Ocean View", "Free WiFi", "Mini Bar", "Jacuzzi", "Living Area", "Butler Service"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
    ],
    totalRooms: 5,
    extraBedPrice: 5000
  },
  {
    id: 3,
    name: "Beachfront Villa",
    type: "villa",
    description: "Private villa directly on the beach with private pool, garden, and outdoor living space.",
    price: 65000,
    capacity: 6,
    size: "120 m²",
    beds: "2 King Beds + 2 Twin Beds",
    amenities: ["Private Pool", "Beach Access", "Free WiFi", "Full Kitchen", "Garden", "Private Terrace"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
    ],
    totalRooms: 3,
    extraBedPrice: 6000
  },
  {
    id: 4,
    name: "Penthouse Suite",
    type: "penthouse",
    description: "Top-floor penthouse with 360° views, private rooftop terrace, and exclusive amenities.",
    price: 100000,
    capacity: 4,
    size: "150 m²",
    beds: "2 King Beds",
    amenities: ["Rooftop Terrace", "360° View", "Private Bar", "Jacuzzi", "Home Theater", "Concierge"],
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
    ],
    totalRooms: 2,
    extraBedPrice: 8000
  },
  {
    id: 5,
    name: "Standard Garden Room",
    type: "standard",
    description: "Cozy room with garden views, perfect for budget-conscious travelers.",
    price: 12000,
    capacity: 2,
    size: "30 m²",
    beds: "1 Queen Bed",
    amenities: ["Garden View", "Free WiFi", "Air Conditioning", "Flat-screen TV", "Tea/Coffee Maker"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80"
    ],
    totalRooms: 15,
    extraBedPrice: 3000
  },
  {
    id: 6,
    name: "Family Suite",
    type: "family",
    description: "Two-bedroom suite ideal for families, with kid-friendly amenities and connecting rooms.",
    price: 50000,
    capacity: 6,
    size: "90 m²",
    beds: "1 King + 2 Queen Beds",
    amenities: ["Family Room", "Kids Club", "Free WiFi", "Kitchenette", "Game Console", "Baby Cot"],
    image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
    ],
    totalRooms: 6,
    extraBedPrice: 5000
  }
];

export const roomTypes = [
  { id: "all", label: "All Rooms", icon: "🏠" },
  { id: "standard", label: "Standard", icon: "🌿" },
  { id: "deluxe", label: "Deluxe", icon: "🌊" },
  { id: "suite", label: "Suite", icon: "✨" },
  { id: "villa", label: "Villa", icon: "🏡" },
  { id: "penthouse", label: "Penthouse", icon: "🔝" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" }
];

export default rooms;
