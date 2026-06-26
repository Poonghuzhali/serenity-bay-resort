import { useState } from "react";

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function PaymentForm({ onSubmit, total, roomName }) {
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ name: "", cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cardNumber") formatted = formatCardNumber(value);
    if (name === "expiry") formatted = formatExpiry(value);
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 3);
    setCard({ ...card, [name]: formatted });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await new Promise((r) => setTimeout(r, method === "online" ? 800 : 1500));

    const payload = method === "online"
      ? { method: "online" }
      : { name: card.name, cardNumber: card.cardNumber, expiry: card.expiry, cvv: card.cvv };

    const result = onSubmit(payload);

    if (result) setErrors(result);
    setProcessing(false);
  };

  const fields = [
    { name: "name", label: "Cardholder Name", type: "text", placeholder: "John Doe", maxLength: 50 },
    { name: "cardNumber", label: "Card Number", type: "text", placeholder: "4242 4242 4242 4242", maxLength: 19 },
    { name: "expiry", label: "Expiry Date", type: "text", placeholder: "MM/YY", maxLength: 5 },
    { name: "cvv", label: "CVV", type: "text", placeholder: "123", maxLength: 3 },
  ];

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-semibold text-gray-800 mb-3">💳 Payment Details</h4>
      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
        <div className="flex justify-between"><span className="text-gray-600">Room:</span><span>{roomName}</span></div>
        <div className="flex justify-between font-bold mt-1"><span>Total:</span><span className="text-blue-600">₹{total.toLocaleString("en-IN")}</span></div>
      </div>

      <div className="flex gap-3 mb-4">
        <button type="button" onClick={() => setMethod("card")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition ${method === "card" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
          💳 Card Payment
        </button>
        <button type="button" onClick={() => setMethod("online")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition ${method === "online" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
          📱 Online Payment
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {method === "card" ? (
          <>
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  type={f.type} name={f.name} value={card[f.name]} onChange={handleChange}
                  maxLength={f.maxLength}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors[f.name] ? "border-red-500" : "border-gray-300"}`}
                  placeholder={f.placeholder}
                />
                {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
              </div>
            ))}
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 text-center">
            You will be redirected to your preferred online payment method.
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-2 rounded text-sm">{errors.general}</div>
        )}

        <button type="submit" disabled={processing}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing Payment...
            </span>
          ) : `Pay ₹${total.toLocaleString("en-IN")} (${method === "online" ? "Online" : "Card"})`}
        </button>
      </form>

      {method === "card" && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-600">
          🔒 Test Card: 4242 4242 4242 4242 | Any future expiry | Any 3-digit CVV
        </div>
      )}
    </div>
  );
}
