import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roles = [
  { id: "customer", label: "Customer", icon: "👤", desc: "Manage your bookings" },
  { id: "admin", label: "Admin", icon: "🔑", desc: "Manage resort operations" },
];

export default function Login() {
  const { user, login } = useAuth();
  const [searchParams] = useSearchParams();
  const urlRedirect = searchParams.get("redirect") || "";
  const [redirectTo] = useState(urlRedirect || sessionStorage.getItem("login_redirect") || "");
  const [selectedRole, setSelectedRole] = useState("customer");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  if (user) {
    if (redirectTo && !urlRedirect) sessionStorage.removeItem("login_redirect");
    return <Navigate to={redirectTo || (user.role === "admin" ? "/admin" : "/dashboard")} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = login(form.email, form.password, selectedRole);
    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl">🏝️</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</h2>
          <p className="text-gray-500">Select your login type</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {roles.map((r) => (
            <button key={r.id} type="button" onClick={() => { setSelectedRole(r.id); setErrors({}); setServerError(""); }}
              className={`p-4 rounded-xl border-2 text-center transition ${
                selectedRole === r.id
                  ? r.id === "admin"
                    ? "border-purple-500 bg-purple-50"
                    : "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}>
              <span className="text-2xl block mb-1">{r.icon}</span>
              <p className={`font-semibold text-sm ${selectedRole === r.id ? (r.id === "admin" ? "text-purple-700" : "text-blue-700") : "text-gray-600"}`}>
                {r.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
            </button>
          ))}
        </div>

        {selectedRole === "admin" && (
          <div className="bg-purple-50 border border-purple-200 text-purple-700 p-3 rounded-lg mb-4 text-xs flex items-center gap-2">
            <span>🔑</span>
            <span>Admin access — manage rooms, bookings, and customer messages</span>
          </div>
        )}

        {(serverError || Object.keys(errors).length > 0) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {serverError || Object.values(errors)[0]}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.password ? "border-red-500" : "border-gray-300"}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className={`w-full text-white py-2.5 rounded-lg font-medium transition ${selectedRole === "admin" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}>
            Sign In as {selectedRole === "admin" ? "Admin" : "Customer"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-medium mb-1">Quick Fill:</p>
          <div className="space-y-2">
            <div className={`p-2 rounded flex items-center justify-between ${selectedRole === "customer" ? "bg-blue-50 border border-blue-200" : ""}`}>
              <span><span className="font-medium">Customer:</span> john@example.com / password123</span>
              <button type="button" onClick={() => { setSelectedRole("customer"); setForm({ email: "john@example.com", password: "password123" }); setErrors({}); setServerError(""); }}
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs">
                Fill
              </button>
            </div>
            <div className={`p-2 rounded flex items-center justify-between ${selectedRole === "admin" ? "bg-purple-50 border border-purple-200" : ""}`}>
              <span><span className="font-medium">Admin:</span> admin@serenitybay.com / admin123</span>
              <button type="button" onClick={() => { setSelectedRole("admin"); setForm({ email: "admin@serenitybay.com", password: "admin123" }); setErrors({}); setServerError(""); }}
                className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-xs">
                Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
