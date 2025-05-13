import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await resetPassword(token, password);
      setMsg("✅ Password reset successful. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg("❌ Password reset failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] text-white">
      <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded border border-white/20 w-full max-w-sm">
        <h2 className="text-xl mb-4">Reset Password</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full p-3 mb-4 rounded bg-white/5 text-white border border-white/20" />
        <button className="w-full bg-[#DBAAA7] text-black py-2 rounded">Reset Password</button>
        {msg && <p className="mt-4 text-sm text-gray-300">{msg}</p>}
      </form>
    </div>
  );
}
