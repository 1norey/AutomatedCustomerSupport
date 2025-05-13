import React from "react";
import { Link } from "react-router-dom";

export default function CheckEmailNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] text-white">
      <div className="text-center bg-white/10 border border-white/20 p-8 rounded-lg">
        <h2 className="text-xl mb-4">Verify your email</h2>
        <p>We've sent you a verification email. Please check your inbox.</p>
        <Link to="/login" className="mt-4 inline-block text-[#DBAAA7] underline">Back to login</Link>
      </div>
    </div>
  );
}
