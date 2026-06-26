import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "📊 Dashboard", end: true },
  { to: "/admin/rooms", label: "🏠 Manage Rooms" },
  { to: "/admin/bookings", label: "📋 All Bookings" },
  { to: "/admin/messages", label: "✉️ Messages" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 hidden md:block">
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
  return (
    <nav className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end}
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${isActive ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`
          }>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
