import { useState } from "react";

function validateForm(data) {
  const errs = {};
  if (!data.name.trim()) errs.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Invalid email";
  if (!data.subject.trim()) errs.subject = "Subject is required";
  if (!data.message.trim()) errs.message = "Message is required";
  if (data.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
  return errs;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const messages = JSON.parse(localStorage.getItem("resort_messages") || "[]");
    messages.push({
      id: "MSG" + Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
      status: "unread"
    });
    localStorage.setItem("resort_messages", JSON.stringify(messages));

    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
          <p className="text-gray-500 mb-4">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Get In Touch</h1>
            <p className="text-gray-500 mb-6">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.subject ? "border-red-500" : "border-gray-300"}`} />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows="5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${errors.message ? "border-red-500" : "border-gray-300"}`}></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition">
                Send Message 📤
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-semibold text-gray-800 mb-4">📍 Visit Us</h3>
              <p className="text-gray-600">123 Beach Road,<br />North Malé Atoll,<br />Maldives 20026</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-semibold text-gray-800 mb-4">📞 Call Us</h3>
              <p className="text-gray-600">Reservations: +1 (555) 123-4567</p>
              <p className="text-gray-600">Front Desk: +1 (555) 987-6543</p>
              <p className="text-sm text-gray-400 mt-2">Available 24/7</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-semibold text-gray-800 mb-4">✉️ Email Us</h3>
              <p className="text-gray-600">info@serenitybay.com</p>
              <p className="text-gray-600">reservations@serenitybay.com</p>
              <p className="text-sm text-gray-400 mt-2">We reply within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
