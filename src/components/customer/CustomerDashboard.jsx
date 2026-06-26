import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();
  const bookings = getUserBookings(user?.id);

  const handleCancel = (id) => {
    if (window.confirm("Cancel this booking?")) {
      cancelBooking(id);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
            <p className="text-gray-500 text-sm">Total Bookings</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{activeBookings.length}</p>
            <p className="text-gray-500 text-sm">Active Stays</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">${bookings.reduce((s, b) => s + (b.totalAmount || 0), 0)}</p>
            <p className="text-gray-500 text-sm">Total Spent</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl">🏝️</span>
              <p className="text-gray-500 mt-4 mb-4">No bookings yet. Start planning your vacation!</p>
              <Link to="/rooms" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
                Browse Rooms
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.reverse().map((b) => (
                <div key={b.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{b.roomName}</h3>
                      <p className="text-sm text-gray-500">Booking: {b.id}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>📅 {b.checkIn} → {b.checkOut}</span>
                        <span>👤 {b.adults} Adult{b.adults > 1 ? "s" : ""}{b.children > 0 ? `, ${b.children} Child${b.children > 1 ? "ren" : ""}` : ""}{b.extraBed ? " +1 Bed" : ""}</span>
                        <span>💰 ${b.totalAmount}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {b.status === "confirmed" ? "✓ Confirmed" : "✗ Cancelled"}
                      </span>
                      {b.status === "confirmed" && (
                        <button onClick={() => handleCancel(b.id)} className="block mt-2 text-red-600 hover:text-red-700 text-xs font-medium">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
