import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import rooms from "../../data/rooms";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import PaymentForm from "../booking/PaymentForm";
import BookingConfirmation from "../booking/BookingConfirmation";

const DRAFT_KEY = "room_draft";

function loadDraft(roomId) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft.roomId === roomId ? draft : null;
  } catch { return null; }
}

function saveDraft(data) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export default function RoomDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRoomAvailability, createBooking, validatePayment } = useBooking();

  const today = new Date().toISOString().split("T")[0];
  const room = rooms.find((r) => r.id === Number(id));

  const draft = loadDraft(Number(id));

  const [checkIn, setCheckIn] = useState(draft?.checkIn ?? searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(draft?.checkOut ?? searchParams.get("checkOut") ?? "");
  const [adults, setAdults] = useState(draft?.adults ?? (Number(searchParams.get("adults")) || 1));
  const [children, setChildren] = useState(draft?.children ?? (Number(searchParams.get("children")) || 0));
  const [quantity, setQuantity] = useState(draft?.quantity ?? Math.max(1, Number(searchParams.get("qty")) || 1));
  const [extraBed, setExtraBed] = useState(draft?.extraBed ?? false);
  const [activeImg, setActiveImg] = useState(0);
  const [step, setStep] = useState(draft?.step ?? 1);
  const [availability, setAvailability] = useState(draft?.availability ?? null);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (room) {
      saveDraft({ roomId: room.id, checkIn, checkOut, adults, children, quantity, extraBed, step, availability });
    }
  }, [room, checkIn, checkOut, adults, children, quantity, extraBed, step, availability]);

  if (!room) {
    clearDraft();
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
  const totalGuests = adults + children;
  const perRoomCapacity = extraBed ? room.capacity + 1 : room.capacity;
  const maxCapacity = perRoomCapacity * quantity;
  const extraBedCost = extraBed ? room.extraBedPrice * nights * quantity : 0;
  const roomCost = room.price * nights * quantity;
  const total = roomCost + extraBedCost;

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) { setError("Please select check-in and check-out dates"); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { setError("Check-out must be after check-in"); return; }
    if (adults < 1) { setError("At least 1 adult required"); return; }
    if (totalGuests > maxCapacity) {
      setError(`Maximum ${perRoomCapacity} guest(s) per room (${quantity} room(s) = ${maxCapacity} guests). Reduce guests or book more rooms.`);
      return;
    }
    setError("");
    const result = getRoomAvailability(room.id, checkIn, checkOut);
    setAvailability(result);
    if (result.available && result.availableRooms >= quantity) {
      setStep(2);
    } else if (result.availableRooms < quantity) {
      setError(`Only ${result.availableRooms} of ${room.totalRooms} rooms available. Reduce quantity to ${result.availableRooms}.`);
    } else {
      setError("This room is not available for selected dates");
    }
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
      adults,
      children,
      totalGuests,
      extraBed,
      rooms: quantity,
      totalAmount: total,
      cardLast4: cardDetails.cardNumber.replace(/\s/g, "").slice(-4),
    });

    if (result.success) {
      clearDraft();
      setBookingResult(result.booking);
      setStep(3);
      return null;
    } else {
      setError(result.error);
      setStep(2);
      return { general: result.error };
    }
  };

  const currentAvail = availability ? availability.availableRooms : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/rooms" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Rooms</Link>

        {step === 3 && bookingResult ? (
          <BookingConfirmation booking={bookingResult} room={room} nights={nights} quantity={quantity} />
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
                  <span>👤 Up to {room.capacity} guests per room</span>
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
                    Only {availability.availableRooms} of {room.totalRooms} rooms available
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <input type="number" min="1" value={adults} onChange={(e) => { setAdults(Math.max(1, Number(e.target.value) || 1)); setStep(1); setAvailability(null); setError(""); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                      <input type="number" min="0" value={children} onChange={(e) => { setChildren(Math.max(0, Number(e.target.value) || 0)); setStep(1); setAvailability(null); setError(""); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <select value={quantity} onChange={(e) => { setQuantity(Number(e.target.value)); setStep(1); setAvailability(null); setError(""); }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {Array.from({ length: currentAvail ?? room.totalRooms }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} room{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>

                  {totalGuests > 0 && totalGuests > perRoomCapacity && !extraBed && quantity === 1 && (
                    <div className="text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg">
                      Guest count exceeds room capacity ({room.capacity}). Add an extra bed or book more rooms.
                    </div>
                  )}

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={extraBed} onChange={(e) => { setExtraBed(e.target.checked); setStep(1); setAvailability(null); setError(""); }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Add Extra Bed</span>
                      <span className="text-sm text-gray-400 ml-2">+₹{room.extraBedPrice}/night/room</span>
                    </div>
                  </label>

                  {totalGuests > maxCapacity && (
                    <div className="text-red-500 text-sm">
                      Maximum {maxCapacity} guests across {quantity} room(s). Reduce guest count or increase rooms.
                    </div>
                  )}

                  {nights > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between"><span>₹{room.price.toLocaleString("en-IN")} x {quantity} room(s) x {nights} nights</span><span>₹{roomCost.toLocaleString("en-IN")}</span></div>
                      {extraBed && (
                        <div className="flex justify-between text-gray-600">
                          <span>Extra bed ₹{room.extraBedPrice.toLocaleString("en-IN")} x {quantity} x {nights}</span><span>+₹{extraBedCost.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-base">
                        <span>Total</span><span className="text-blue-600">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <button onClick={handleCheckAvailability} disabled={totalGuests > maxCapacity}
                      className={`w-full text-white py-3 rounded-lg font-medium transition ${totalGuests > maxCapacity ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                      Check Availability
                    </button>
                  )}

                  {step === 2 && (
                    <>
                      {!user ? (
                        <div className="text-center space-y-3">
                          <p className="text-sm text-gray-600">You need to log in to complete the booking.</p>
                          <button onClick={() => navigate("/login?redirect=" + encodeURIComponent(window.location.href))}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">
                            Proceed to Login
                          </button>
                        </div>
                      ) : (
                        <PaymentForm onSubmit={handleBooking} total={total} roomName={room.name} />
                      )}
                    </>
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
