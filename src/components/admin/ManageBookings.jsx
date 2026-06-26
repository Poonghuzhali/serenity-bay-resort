import { useState } from "react";
import { useBooking } from "../../context/BookingContext";

export default function ManageBookings() {
  const { getAllBookings, cancelBooking } = useBooking();
  const bookings = getAllBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCancel = (id) => {
    if (window.confirm("Cancel this booking?")) {
      cancelBooking(id);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this booking record permanently?")) return;
    const allBookings = JSON.parse(localStorage.getItem("resort_bookings") || "[]");
    const filtered = allBookings.filter((b) => b.id !== id);
    localStorage.setItem("resort_bookings", JSON.stringify(filtered));
    window.location.reload();
  };

  let filtered = bookings;
  if (statusFilter !== "all") filtered = filtered.filter((b) => b.status === statusFilter);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((b) =>
      b.userName?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      b.roomName?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q) ||
      b.checkIn?.includes(q) ||
      b.checkOut?.includes(q)
    );
  }

  const sorted = [...filtered].reverse();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Bookings ({bookings.length})</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest, room, email, ID, or dates..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          <div className="flex gap-2">
            {["all", "confirmed", "cancelled"].map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${statusFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Email</th>
                <th className="p-4">Room</th>
                <th className="p-4">Rooms</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Nights</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => {
                const nights = b.checkIn && b.checkOut
                  ? Math.max(0, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)))
                  : 0;
                return (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs">{b.id}</td>
                    <td className="p-4 font-medium">{b.userName}</td>
                    <td className="p-4 text-gray-500">{b.userEmail}</td>
                    <td className="p-4">{b.roomName}</td>
                    <td className="p-4 text-center">{b.rooms || 1}</td>
                    <td className="p-4 text-sm">{b.adults} Adult{b.adults > 1 ? "s" : ""}{b.children > 0 ? `, ${b.children} Child${b.children > 1 ? "ren" : ""}` : ""}{b.extraBed ? ", +Extra Bed" : ""}</td>
                    <td className="p-4">{b.checkIn}</td>
                    <td className="p-4">{b.checkOut}</td>
                    <td className="p-4">{nights}</td>
                    <td className="p-4 font-medium">₹{(b.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="p-4 text-xs">{b.paymentMethod || "Card"} {b.cardLast4 && b.paymentMethod !== "Online" ? "**** " + b.cardLast4 : ""}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {b.status === "confirmed" && (
                          <button onClick={() => handleCancel(b.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-medium">
                            Cancel
                          </button>
                        )}
                        <button onClick={() => handleDelete(b.id)}
                          className="text-gray-400 hover:text-red-600 text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr><td colSpan={12} className="p-8 text-center text-gray-400">
                  {bookings.length === 0 ? "No bookings found" : "No bookings match your search"}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
