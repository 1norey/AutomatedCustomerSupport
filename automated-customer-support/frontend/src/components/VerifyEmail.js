import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../api/authApi";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    verifyEmail(token)
      .then(() => setMessage("✅ Your email has been verified. You can now log in."))
      .catch(() => setMessage("❌ Verification failed or token is invalid."));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] text-white">
      <div className="text-center p-6 bg-white/10 border border-white/20 rounded-lg max-w-md">
        <p className="mb-4">{message}</p>
        <Link to="/login" className="text-[#DBAAA7] underline">Go to Login</Link>
      </div>
    </div>
  );
}
