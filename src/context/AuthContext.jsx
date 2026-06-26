import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "resort_auth";

const ADMIN_CREDENTIALS = { email: "admin@serenitybay.com", password: "admin123", name: "Admin", role: "admin" };

const DEMOS = [
  { id: "2", name: "John Doe", email: "john@example.com", password: "password123", phone: "+1 555-000-0002", role: "customer" },
  { id: "3", name: "Sarah Smith", email: "sarah@example.com", password: "password123", phone: "+1 555-000-0003", role: "customer" },
];

function ensureUsers() {
  const raw = localStorage.getItem("resort_users");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return;
    } catch {}
  }
  localStorage.setItem("resort_users", JSON.stringify(DEMOS));
}

ensureUsers();

const validations = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email address",
  password: (v) => v.length >= 6 || "Password must be at least 6 characters",
  name: (v) => v.trim().length >= 2 || "Name must be at least 2 characters",
  phone: (v) => /^\+?[\d\s-]{10,15}$/.test(v) || "Invalid phone number",
};

function validate(fields) {
  const errors = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!value?.toString().trim()) {
      errors[key] = `${key} is required`;
    } else if (validations[key]) {
      const result = validations[key](value);
      if (result !== true) errors[key] = result;
    }
  }
  return errors;
}

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = (email, password, role) => {
    if (role === "admin") {
      if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
        return { success: false, errors: { email: "Invalid admin credentials" } };
      }
      const userData = { id: "admin", name: ADMIN_CREDENTIALS.name, email: ADMIN_CREDENTIALS.email, role: ADMIN_CREDENTIALS.role, phone: "" };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }

    const errs = validate({ email, password });
    if (Object.keys(errs).length) return { success: false, errors: errs };

    ensureUsers();

    const users = JSON.parse(localStorage.getItem("resort_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, errors: { email: "Invalid email or password. Please check your credentials or register a new account." } };

    const userData = { id: found.id, name: found.name, email: found.email, role: found.role, phone: found.phone };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return { success: true, user: userData };
  };

  const register = (data) => {
    const errs = validate(data);
    if (Object.keys(errs).length) return { success: false, errors: errs };

    const users = JSON.parse(localStorage.getItem("resort_users") || "[]");
    if (users.find((u) => u.email === data.email)) {
      return { success: false, errors: { email: "Email already registered" } };
    }

    const newUser = { id: Date.now().toString(), ...data, role: "customer" };
    users.push(newUser);
    localStorage.setItem("resort_users", JSON.stringify(users));
    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, validate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
