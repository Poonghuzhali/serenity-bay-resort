import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
          alt="Resort"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-blue-300">Serenity Bay</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Experience unparalleled luxury nestled between pristine beaches and crystal-clear waters. 
          Your dream vacation begins here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/rooms" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition">
            Explore Rooms
          </Link>
          <Link to="/contact" className="bg-white/20 hover:bg-white/30 text-white border border-white px-8 py-3 rounded-full text-lg font-medium backdrop-blur-sm transition">
            Contact Us
          </Link>
        </div>
        <div className="mt-12 flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-3xl font-bold">6</div>
            <div className="text-gray-300">Room Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-gray-300">Happy Guests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">4.9</div>
            <div className="text-gray-300">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
