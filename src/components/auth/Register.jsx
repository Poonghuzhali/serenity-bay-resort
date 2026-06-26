import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const { confirmPassword: _cp, ...data } = form;
    const result = register(data);
    if (result.success) {
      navigate("/login");
    } else {
      setErrors(result.errors || {});
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 555-123-4567" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🏝️</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h2>
          <p className="text-gray-500">Join Serenity Bay Resort</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors[f.name] ? "border-red-500" : "border-gray-300"}`}
                placeholder={f.placeholder}
              />
              {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
            </div>
          ))}

          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
