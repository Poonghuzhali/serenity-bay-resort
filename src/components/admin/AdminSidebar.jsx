import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const links = [
  { to: "/admin", label: "📊 Dashboard", end: true },
  { to: "/admin/rooms", label: "🏠 Manage Rooms" },
  { to: "/admin/bookings", label: "📋 All Bookings" },
  { to: "/admin/messages", label: "✉️ Messages" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 hidden lg:block">
      <h2 className="text-lg font-bold text-gray-800 mb-6 px-4">Admin Panel</h2>
      <nav className="space-y-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`
            }>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const current = links.find((l) =>
    l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  return (
    <div className="lg:hidden mb-4 relative">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-400 transition">
        <span>{current?.label || "Navigate..."}</span>
        <svg className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {links.map((l) => {
            const isActive = l.end ? location.pathname === l.to : location.pathname.startsWith(l.to);
            return (
              <button key={l.to} onClick={() => { navigate(l.to); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition ${isActive ? "bg-blue-600 text-white font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                {l.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
