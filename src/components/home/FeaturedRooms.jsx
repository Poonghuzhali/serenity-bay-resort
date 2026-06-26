import { Link } from "react-router-dom";
import rooms from "../../data/rooms";

export default function FeaturedRooms() {
  const featured = rooms.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Featured Rooms</h2>
          <p className="text-gray-500 mt-2">Hand-picked accommodations for an unforgettable stay</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition">
              <div className="relative h-56 overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ${room.price}/night
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{room.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>👤 Up to {room.capacity} guests</span>
                  <span>📐 {room.size}</span>
                </div>
                <Link to={`/rooms/${room.id}`} className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/rooms" className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white font-medium transition">
            View All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}
