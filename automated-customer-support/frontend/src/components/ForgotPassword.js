import React, { useState } from "react";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await forgotPassword(email);
      setMsg("✅ Reset link sent to your email.");
    } catch (err) {
      setMsg("❌ Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] text-white">
      <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded border border-white/20 w-full max-w-sm">
        <h2 className="text-xl mb-4">Forgot Password</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full p-3 mb-4 rounded bg-white/5 text-white border border-white/20" />
        <button className="w-full bg-[#DBAAA7] text-black py-2 rounded">Send Reset Link</button>
        {msg && <p className="mt-4 text-sm text-gray-300">{msg}</p>}
      </form>
    </div>
  );
}
