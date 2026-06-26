import rooms from "../../data/rooms";

function getBookings() {
  return JSON.parse(localStorage.getItem("resort_bookings") || "[]");
}

export default function ManageRooms() {
  const allBookings = getBookings().filter((b) => b.status === "confirmed");

  const roomBookings = {};
  rooms.forEach((room) => {
    const bookings = allBookings.filter((b) => b.roomId === room.id);
    roomBookings[room.id] = bookings;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Rooms</h1>

      <div className="space-y-4">
        {rooms.map((room) => {
          const bookings = roomBookings[room.id];
          const bookedCount = bookings.reduce((s, b) => s + (b.rooms || 1), 0);
          const available = room.totalRooms - bookedCount;

          return (
            <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} · {room.size} · {room.beds}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">₹{room.price.toLocaleString("en-IN")}<span className="text-xs text-gray-400">/night</span></p>
                      <p className="text-sm font-medium">
                        <span className={available > 0 ? "text-green-600" : "text-red-600"}>{available}</span>
                        <span className="text-gray-400">/{room.totalRooms} available</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {room.amenities.map((a) => (
                      <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{a}</span>
                    ))}
                  </div>
                  {bookings.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-medium text-gray-500 mb-2">Currently Booked ({bookings.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {bookings.map((b) => (
                          <span key={b.id} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                            {b.checkIn} → {b.checkOut} ({b.userName})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
