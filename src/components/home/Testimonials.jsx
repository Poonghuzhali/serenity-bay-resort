import { useState } from "react";
import reviews from "../../data/reviews";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">What Our Guests Say</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <img src={reviews[active].avatar} alt={reviews[active].name} className="w-20 h-20 rounded-full object-cover border-4 border-blue-100" />
          </div>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-xl ${star <= reviews[active].rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
            ))}
          </div>
          <p className="text-gray-600 text-lg italic mb-6">"{reviews[active].text}"</p>
          <p className="font-semibold text-gray-800">{reviews[active].name}</p>
          <p className="text-gray-400 text-sm">{reviews[active].date}</p>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`w-3 h-3 rounded-full transition ${i === active ? "bg-blue-600 w-6" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
