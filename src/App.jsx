import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./components/home/HomePage";
import RoomList from "./components/rooms/RoomList";
import RoomDetail from "./components/rooms/RoomDetail";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ContactPage from "./components/booking/ContactPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageRooms from "./components/admin/ManageRooms";
import ManageBookings from "./components/admin/ManageBookings";
import AdminMessages from "./components/admin/AdminMessages";
import CustomerDashboard from "./components/customer/CustomerDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute role="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="rooms" element={<ManageRooms />} />
                  <Route path="bookings" element={<ManageBookings />} />
                  <Route path="messages" element={<AdminMessages />} />
                </Route>

                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <span className="text-6xl">🔍</span>
                      <h2 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
                      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
