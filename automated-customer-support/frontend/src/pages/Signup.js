import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "client" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(formData);
      navigate("/check-email");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#1a1a2e] text-white">
      <div className="w-full max-w-md bg-white/10 p-8 rounded-xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-[#A8DCAB] text-center">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 rounded bg-white/5 text-white border border-white/20" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 rounded bg-white/5 text-white border border-white/20" />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-3 rounded bg-white/5 text-white border border-white/20">
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
          {error && <p className="text-red-400">{error}</p>}
          <button type="submit" className="w-full bg-[#DBAAA7] text-black font-bold py-3 rounded">Sign Up</button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account? <Link to="/login" className="text-[#DBAAA7] hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
