import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/rooms", label: "Rooms" },
    { to: "/contact", label: "Contact" },
  ];

  const adminLinks = [
    { to: "/admin", label: "📊 Dashboard" },
    { to: "/admin/rooms", label: "🏠 Manage Rooms" },
    { to: "/admin/bookings", label: "📋 All Bookings" },
    { to: "/admin/messages", label: "✉️ Messages" },
  ];

  const customerLinks = [
    { to: "/dashboard", label: "📋 My Bookings" },
  ];

  if (user) {
    if (user.role === "admin") {
      links.push({ to: "/admin", label: "Admin Panel" });
    } else {
      links.push({ to: "/dashboard", label: "My Dashboard" });
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏝️</span>
            <span className="text-xl font-bold text-gray-800">Serenity Bay</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-gray-600 hover:text-blue-600 font-medium transition">
                {l.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l">
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden flex items-center text-gray-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t pb-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 font-medium">
              {l.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <div className="border-t mx-4 pt-2 mt-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Admin</p>
              {adminLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-1.5 text-sm text-gray-500 hover:text-blue-600">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
          {user?.role === "customer" && (
            <div className="border-t mx-4 pt-2 mt-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">My Account</p>
              {customerLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-1.5 text-sm text-gray-500 hover:text-blue-600">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
          <div className="border-t mt-2 pt-2 px-4">
            {user ? (
              <>
                <span className="block text-sm text-gray-500 mb-2">Hi, {user.name}</span>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
