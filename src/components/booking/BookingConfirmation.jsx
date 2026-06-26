import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BookingConfirmation({ booking, room, nights, quantity }) {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">Your reservation has been successfully made.</p>

        <div className="bg-green-50 rounded-xl p-6 mb-6 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Booking ID:</span><br /><span className="font-semibold">{booking.id}</span></div>
            <div><span className="text-gray-500">Status:</span><br /><span className="text-green-600 font-semibold">✓ Confirmed</span></div>
            <div><span className="text-gray-500">Room(s):</span><br /><span className="font-semibold">{room.name} × {(booking.rooms || quantity || 1)}</span></div>
            <div><span className="text-gray-500">Total Paid:</span><br /><span className="font-semibold text-blue-600">₹{booking.totalAmount?.toLocaleString("en-IN")}</span></div>
            <div><span className="text-gray-500">Check In:</span><br /><span className="font-semibold">{booking.checkIn}</span></div>
            <div><span className="text-gray-500">Check Out:</span><br /><span className="font-semibold">{booking.checkOut}</span></div>
            <div><span className="text-gray-500">Nights:</span><br /><span className="font-semibold">{nights}</span></div>
            <div><span className="text-gray-500">Guests:</span><br /><span className="font-semibold">{booking.adults} Adult{booking.adults > 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}` : ""}</span></div>
            {booking.extraBed && <div><span className="text-gray-500">Extra Bed:</span><br /><span className="font-semibold">Yes</span></div>}
            <div><span className="text-gray-500">Card:</span><br /><span className="font-semibold">**** {booking.cardLast4}</span></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user && (
            <Link to={user.role === "admin" ? "/admin" : "/dashboard"}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition">
              {user.role === "admin" ? "Go to Admin Panel" : "View My Bookings"}
            </Link>
          )}
          <Link to="/rooms" className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-medium transition">
            Book Another Room
          </Link>
        </div>
      </div>
    </div>
  );
}
