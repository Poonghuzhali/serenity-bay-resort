import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({ checkIn, checkOut, adults, children });
    navigate(`/rooms?${params}`);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
          alt="Resort"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-5xl w-full">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
          Welcome to <span className="text-blue-300">Serenity Bay</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Experience unparalleled luxury nestled between pristine beaches and crystal-clear waters. 
          Your dream vacation begins here.
        </p>

        <form onSubmit={handleSearch} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Check In</label>
              <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Check Out</label>
              <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Adults</label>
              <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Children</label>
              <select value={children} onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
            Search Available Rooms
          </button>
        </form>

        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-3xl font-bold">6</div>
            <div className="text-gray-300">Room Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-gray-300">Happy Guests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">4.9</div>
            <div className="text-gray-300">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
