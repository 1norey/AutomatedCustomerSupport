import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }
  const role = user?.role; // "admin", "agent", or undefined

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    // You could also clear tokens etc. here if needed
    navigate("/login"); // Redirect to login page
    window.location.reload(); // Ensures UI updates across the app
  };

  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-[#A8DCAB] text-[#0f0f0f] shadow-lg flex flex-col justify-between py-10 px-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-[#519755] tracking-wide">AutoSupport AI</h1>
        <nav className="flex flex-col space-y-4 text-lg font-medium">
          <Link to="/" className="hover:text-[#DBAAA7] transition">Home</Link>
          <Link to="/about" className="hover:text-[#DBAAA7] transition">About Us</Link>
          <Link to="/contact" className="hover:text-[#DBAAA7] transition">Contact</Link>
          <Link to="/try" className="hover:text-[#DBAAA7] transition">Try Now</Link>
          {!user && (
            <>
              <Link to="/signup" className="hover:text-[#DBAAA7] transition">Sign Up</Link>
              <Link to="/login" className="hover:text-[#DBAAA7] transition">Log In</Link>
            </>
          )}
          {(role === "admin" || role === "agent") && (
            <Link to="/dashboard" className="hover:text-[#DBAAA7] transition">Dashboard</Link>
          )}
        </nav>
        {/* Logout button, visible only when logged in */}
        {user && (
          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-[#DBAAA7] text-[#0f0f0f] hover:bg-[#c98686] rounded-lg py-2 font-semibold transition"
          >
            Log Out
          </button>
        )}
      </div>
      <p className="text-sm text-[#519755]">&copy; 2025 AutoSupport AI</p>
    </div>
  );
}
