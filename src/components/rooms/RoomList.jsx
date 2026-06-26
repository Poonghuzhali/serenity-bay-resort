import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { roomTypes } from "../../data/rooms";
import { useBooking } from "../../context/BookingContext";
import RoomCard from "./RoomCard";

export default function RoomList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAvailableRooms } = useBooking();
  const today = new Date().toISOString().split("T")[0];
  const [activeType, setActiveType] = useState("all");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 1);
  const [children, setChildren] = useState(Number(searchParams.get("children")) || 0);
  const [roomQty, setRoomQty] = useState({});

  useEffect(() => {
    setCheckIn(searchParams.get("checkIn") || "");
    setCheckOut(searchParams.get("checkOut") || "");
    setAdults(Number(searchParams.get("adults")) || 1);
    setChildren(Number(searchParams.get("children")) || 0);
  }, [searchParams]);

  let available = getAvailableRooms(checkIn, checkOut);

  if (activeType !== "all") {
    available = available.filter((r) => r.type === activeType);
  }

  const totalGuests = adults + children;

  const handleFilter = (typeId) => {
    setActiveType(typeId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      setSearchParams({ checkIn, checkOut, adults, children });
    }
  };

  const roomsNeeded = (room) => Math.ceil(totalGuests / room.capacity);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Our Rooms</h1>
          <p className="text-gray-500 mt-2">Find the perfect room for your stay</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <input type="number" min="1" value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
              <input type="number" min="0" value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition">
                Check Availability
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          {roomTypes.map((type) => (
            <button key={type.id} onClick={() => handleFilter(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeType === type.id ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"}`}>
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {available.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">😕</span>
            <p className="text-gray-500 mt-4 text-lg">No rooms available for selected dates. Try different dates.</p>
          </div>
        ) : (
          <>
            {checkIn && checkOut && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-6 text-sm">
                {totalGuests} guest{totalGuests > 1 ? "s" : ""} · {checkIn} → {checkOut}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {available.map((room) => {
                const needed = roomsNeeded(room);
                return (
                  <div key={room.id} className="relative">
                    <RoomCard room={room} qty needed={needed} checkIn={checkIn} checkOut={checkOut} adults={adults} children={children} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
