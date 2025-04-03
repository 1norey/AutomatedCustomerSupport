import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi"; // 

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "client" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authApi.post("/auth/signup", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role;
      if (role === "admin" || role === "agent") {
        navigate("/dashboard");
      } else {
        navigate("/try");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-extrabold text-[#A8DCAB] mb-6 text-center">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#519755]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#519755]"
          />
          <select
            name="role"
            onChange={handleChange}
            value={formData.role}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#519755]"
          >
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#DBAAA7] hover:bg-[#c99390] text-black font-bold py-3 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-[#DBAAA7] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
