import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-[#A8DCAB] text-[#0f0f0f] shadow-lg flex flex-col justify-between py-10 px-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-[#519755] tracking-wide">AutoSupport AI</h1>
        <nav className="flex flex-col space-y-4 text-lg font-medium">
          <Link to="/" className="hover:text-[#DBAAA7] transition">Home</Link>
          <Link to="/about" className="hover:text-[#DBAAA7] transition">About Us</Link>
          <Link to="/contact" className="hover:text-[#DBAAA7] transition">Contact</Link>
          <Link to="/try" className="hover:text-[#DBAAA7] transition">Try Now</Link>
          <Link to="/signup" className="hover:text-[#DBAAA7] transition">Sign Up</Link>
          <Link to="/login" className="hover:text-[#DBAAA7] transition">Log In</Link>
        </nav>
      </div>
      <p className="text-sm text-[#519755]">&copy; 2025 AutoSupport AI</p>
    </div>
  );
}
