import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import rooms from "../../data/rooms";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import PaymentForm from "../booking/PaymentForm";
import BookingConfirmation from "../booking/BookingConfirmation";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRoomAvailability, createBooking, validatePayment } = useBooking();

  const today = new Date().toISOString().split("T")[0];
  const room = rooms.find((r) => r.id === Number(id));

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState("");

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl">🔍</span>
          <p className="text-gray-500 mt-4 text-lg">Room not found</p>
          <Link to="/rooms" className="text-blue-600 hover:underline mt-2 inline-block">Back to Rooms</Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = room.price * nights;

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) { setError("Please select check-in and check-out dates"); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { setError("Check-out must be after check-in"); return; }
    setError("");
    const result = getRoomAvailability(room.id, checkIn, checkOut);
    setAvailability(result);
    if (result.available) setStep(2);
    else setError("This room is not available for selected dates");
  };

  const handleBooking = (cardDetails) => {
    if (!user) { navigate("/login"); return; }
    const paymentError = validatePayment(cardDetails);
    if (paymentError) { return paymentError; }

    const result = createBooking({
      roomId: room.id,
      roomName: room.name,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      checkIn,
      checkOut,
      guests: 1,
      totalAmount: total,
      cardLast4: cardDetails.cardNumber.replace(/\s/g, "").slice(-4),
    });

    if (result.success) {
      setBookingResult(result.booking);
      setStep(3);
      return null;
    } else {
      setError(result.error);
      setStep(2);
      return { general: result.error };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/rooms" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Rooms</Link>

        {step === 3 && bookingResult ? (
          <BookingConfirmation booking={bookingResult} room={room} nights={nights} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-80 overflow-hidden">
                  <img src={room.images[activeImg]} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 p-4">
                  {room.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition ${i === activeImg ? "border-blue-600" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{room.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span>🏷️ {room.type.charAt(0).toUpperCase() + room.type.slice(1)}</span>
                  <span>👤 Up to {room.capacity} guests</span>
                  <span>📐 {room.size}</span>
                  <span>🛏️ {room.beds}</span>
                </div>
                <p className="text-gray-600 mb-6">{room.description}</p>

                <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span> {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Book This Room</h3>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
                )}

                {availability && !availability.available && (
                  <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg mb-4 text-sm">
                    Only {availability.totalRooms - availability.bookedCount} of {availability.totalRooms} rooms available
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                    <input type="date" min={today} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setStep(1); setAvailability(null); setError(""); }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                    <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setStep(1); setAvailability(null); setError(""); }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  {nights > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between"><span>${room.price} x {nights} nights</span><span>${total}</span></div>
                      <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-blue-600">${total}</span></div>
                    </div>
                  )}

                  {step === 1 && (
                    <button onClick={handleCheckAvailability} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition">
                      Check Availability
                    </button>
                  )}

                  {step === 2 && (
                    <PaymentForm onSubmit={handleBooking} total={total} roomName={room.name} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
