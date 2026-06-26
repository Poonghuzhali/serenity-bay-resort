import { useState } from "react";
import { Link } from "react-router-dom";

export default function RoomCard({ room, needed, checkIn, checkOut, adults, children }) {
  const [quantity, setQuantity] = useState(1);
  const maxQty = room.totalRooms;

  const params = new URLSearchParams();
  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (adults) params.set("adults", adults);
  if (children) params.set("children", children);
  params.set("qty", quantity);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{room.price.toLocaleString("en-IN")}<span className="text-xs">/night</span>
        </div>
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{room.description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          <span>👤 {room.capacity} guests</span>
          <span>📐 {room.size}</span>
          <span>🛏️ {room.beds}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((a) => (
            <span key={a} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">{a}</span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs text-gray-400">+{room.amenities.length - 4} more</span>
          )}
        </div>
        {checkIn && checkOut && (
          <div className="mb-4">
            {needed > 1 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs p-2 rounded-lg mb-2">
                For {adults + children} guests, you need at least <strong>{needed}</strong> rooms of this type (capacity: {room.capacity})
              </div>
            )}
            {needed === 1 && adults + children > 0 && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-2 rounded-lg mb-2">
                Fits all {adults + children} guests in 1 room (capacity: {room.capacity})
              </div>
            )}
            <label className="block text-xs font-medium text-gray-600 mb-1">Rooms to book</label>
            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} room{n > 1 ? "s" : ""} {n >= needed ? "(recommended)" : ""}</option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-auto">
          <Link to={`/rooms/${room.id}?${params}`} className="inline-block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
