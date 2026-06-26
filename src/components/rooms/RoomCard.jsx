import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition">
      <div className="relative h-56 overflow-hidden">
        <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${room.price}<span className="text-xs">/night</span>
        </div>
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
        </div>
      </div>
      <div className="p-6">
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
        <Link to={`/rooms/${room.id}`} className="inline-block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition">
          Book Now
        </Link>
      </div>
    </div>
  );
}
