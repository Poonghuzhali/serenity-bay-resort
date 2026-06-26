import { createContext, useContext, useState } from "react";
import rooms from "../data/rooms";

const BookingContext = createContext(null);

function getBookings() {
  return JSON.parse(localStorage.getItem("resort_bookings") || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem("resort_bookings", JSON.stringify(bookings));
}

function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getDatesBetween(start, end) {
  const dates = [];
  let current = new Date(start);
  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(getBookings);

  const refresh = () => setBookings(getBookings());

  const getAvailableRooms = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return rooms;
    const start = parseDate(checkIn);
    const end = parseDate(checkOut);
    if (start >= end) return [];

    const requestedDates = getDatesBetween(start, end);
    const allBookings = getBookings();

    return rooms.filter((room) => {
      const bookedCount = allBookings.filter((b) => {
        if (b.roomId !== room.id || b.status === "cancelled") return false;
        const bStart = parseDate(b.checkIn);
        const bEnd = parseDate(b.checkOut);
        const bookedDates = getDatesBetween(bStart, bEnd);
        return requestedDates.some((d) => bookedDates.includes(d));
      }).length;
      return bookedCount < room.totalRooms;
    });
  };

  const getRoomAvailability = (roomId, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return { available: true, bookedCount: 0, totalRooms: 0 };
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return { available: false, bookedCount: 0, totalRooms: 0 };

    const start = parseDate(checkIn);
    const end = parseDate(checkOut);
    if (start >= end) return { available: false, bookedCount: 0, totalRooms: room.totalRooms };

    const requestedDates = getDatesBetween(start, end);
    const allBookings = getBookings();

    const bookedCount = allBookings.filter((b) => {
      if (b.roomId !== roomId || b.status === "cancelled") return false;
      const bStart = parseDate(b.checkIn);
      const bEnd = parseDate(b.checkOut);
      const bookedDates = getDatesBetween(bStart, bEnd);
      return requestedDates.some((d) => bookedDates.includes(d));
    }).length;

    return { available: bookedCount < room.totalRooms, bookedCount, totalRooms: room.totalRooms };
  };

  const createBooking = (bookingData) => {
    const allBookings = getBookings();
    const { roomId, checkIn, checkOut } = bookingData;
    const availability = getRoomAvailability(roomId, checkIn, checkOut);
    if (!availability.available) {
      return { success: false, error: "Room not available for selected dates" };
    }
    const booking = {
      id: "BOK" + Date.now(),
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    allBookings.push(booking);
    saveBookings(allBookings);
    refresh();
    return { success: true, booking };
  };

  const cancelBooking = (bookingId) => {
    const allBookings = getBookings();
    const idx = allBookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) return { success: false, error: "Booking not found" };
    allBookings[idx].status = "cancelled";
    saveBookings(allBookings);
    refresh();
    return { success: true };
  };

  const getUserBookings = (userId) => {
    return getBookings().filter((b) => b.userId === userId);
  };

  const getAllBookings = () => getBookings();

  // Payment validation: dummy card must pass Luhn check, have valid expiry, and 3-digit CVV
  const validatePayment = (cardDetails) => {
    const errors = {};

    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
      errors.cardNumber = "Card number must be 16 digits";
    } else {
      const digits = cardDetails.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(digits)) {
        errors.cardNumber = "Card number must be numeric";
      } else {
        let sum = 0;
        let alternate = false;
        for (let i = digits.length - 1; i >= 0; i--) {
          let n = parseInt(digits[i], 10);
          if (alternate) { n *= 2; if (n > 9) n -= 9; }
          sum += n;
          alternate = !alternate;
        }
        if (sum % 10 !== 0) errors.cardNumber = "Invalid card number";
      }
    }

    if (!cardDetails.expiry) {
      errors.expiry = "Expiry is required";
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = "Use MM/YY format";
    } else {
      const [mm, yy] = cardDetails.expiry.split("/").map(Number);
      if (mm < 1 || mm > 12) errors.expiry = "Invalid month";
      else {
        const now = new Date();
        const expYear = 2000 + yy;
        if (expYear < now.getFullYear() || (expYear === now.getFullYear() && mm < now.getMonth() + 1)) {
          errors.expiry = "Card has expired";
        }
      }
    }

    if (!cardDetails.cvv || !/^\d{3}$/.test(cardDetails.cvv)) {
      errors.cvv = "CVV must be 3 digits";
    }

    if (!cardDetails.name?.trim()) {
      errors.name = "Cardholder name is required";
    }

    return Object.keys(errors).length ? errors : null;
  };

  return (
    <BookingContext.Provider value={{
      bookings, getAvailableRooms, getRoomAvailability,
      createBooking, cancelBooking, getUserBookings,
      getAllBookings, validatePayment, refresh
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export default BookingContext;
