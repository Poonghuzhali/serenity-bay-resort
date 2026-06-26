import { useBooking } from "../../context/BookingContext";
import { Link } from "react-router-dom";
import rooms from "../../data/rooms";

function getMessages() {
  return JSON.parse(localStorage.getItem("resort_messages") || "[]");
}

function getUsers() {
  return JSON.parse(localStorage.getItem("resort_users") || "[]");
}

export default function AdminDashboard() {
  const { getAllBookings } = useBooking();
  const allBookings = getAllBookings();
  const activeBookings = allBookings.filter((b) => b.status === "confirmed");
  const cancelledBookings = allBookings.filter((b) => b.status === "cancelled");
  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const messages = getMessages();
  const unreadMessages = messages.filter((m) => m.status === "unread").length;
  const totalUsers = getUsers().length;

  const occupiedRooms = activeBookings.reduce((acc, b) => {
    const room = rooms.find((r) => r.id === b.roomId);
    if (room) acc[b.roomName] = (acc[b.roomName] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Total Bookings", value: allBookings.length, color: "bg-blue-500" },
    { label: "Active Stays", value: activeBookings.length, color: "bg-green-500" },
    { label: "Cancelled", value: cancelledBookings.length, color: "bg-red-500" },
    { label: "Total Revenue", value: `$${totalRevenue}`, color: "bg-purple-500" },
    { label: "Room Types", value: rooms.length, color: "bg-yellow-500" },
    { label: "Total Rooms", value: rooms.reduce((s, r) => s + r.totalRooms, 0), color: "bg-indigo-500" },
    { label: "Unread Messages", value: unreadMessages, color: "bg-pink-500", link: "/admin/messages" },
    { label: "Registered Users", value: totalUsers, color: "bg-teal-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const content = (
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center text-white text-lg mb-3`}>
                {s.label === "Total Revenue" ? "$" : s.label === "Unread Messages" ? "✉" : s.label === "Registered Users" ? "👤" : s.value.toString()[0]}
              </div>
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          );
          return s.link ? <Link key={s.label} to={s.link}>{content}</Link> : <div key={s.label}>{content}</div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Room Occupancy</h2>
          <div className="space-y-3">
            {rooms.map((room) => {
              const booked = occupiedRooms[room.name] || 0;
              const pct = Math.round((booked / room.totalRooms) * 100);
              return (
                <div key={room.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{room.name}</span>
                    <span className="font-medium">{booked}/{room.totalRooms} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: pct + "%" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/bookings" className="bg-blue-50 text-blue-700 p-4 rounded-xl hover:bg-blue-100 transition text-center">
              <span className="block text-2xl mb-1">📋</span>
              <span className="text-sm font-medium">View All Bookings</span>
            </Link>
            <Link to="/admin/messages" className="bg-pink-50 text-pink-700 p-4 rounded-xl hover:bg-pink-100 transition text-center">
              <span className="block text-2xl mb-1">✉️</span>
              <span className="text-sm font-medium">{unreadMessages > 0 ? `${unreadMessages} Unread Messages` : "All Messages"}</span>
            </Link>
            <Link to="/admin/rooms" className="bg-green-50 text-green-700 p-4 rounded-xl hover:bg-green-100 transition text-center">
              <span className="block text-2xl mb-1">🏠</span>
              <span className="text-sm font-medium">Manage Rooms</span>
            </Link>
            <Link to="/rooms" className="bg-purple-50 text-purple-700 p-4 rounded-xl hover:bg-purple-100 transition text-center">
              <span className="block text-2xl mb-1">🔍</span>
              <span className="text-sm font-medium">Browse as Guest</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Room</th>
                <th className="pb-3 pr-4">Check In</th>
                <th className="pb-3 pr-4">Check Out</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.slice(-5).reverse().map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs">{b.id}</td>
                  <td className="py-3 pr-4">{b.userName}</td>
                  <td className="py-3 pr-4">{b.roomName}</td>
                  <td className="py-3 pr-4">{b.checkIn}</td>
                  <td className="py-3 pr-4">{b.checkOut}</td>
                  <td className="py-3 pr-4 font-medium">${b.totalAmount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {allBookings.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
