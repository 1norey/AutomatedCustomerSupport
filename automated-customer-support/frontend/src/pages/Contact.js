import React from "react";
import Sidebar from "../components/SideBar";

export default function Contact() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] relative">
        {/* Animated Robot */}
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-full bg-[#A8DCAB] flex items-center justify-center shadow-2xl animate-bounce-slow">
            <span className="text-7xl">🤖</span>
          </div>
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#DBAAA7] px-4 py-1 rounded-full text-sm text-black shadow animate-pulse">
            AI Bot says hi!
          </span>
        </div>
        {/* Main Content */}
        <h1 className="text-4xl text-[#A8DCAB] font-bold mb-4 text-center">
          Contact Us?
        </h1>
        <p className="text-lg max-w-xl text-gray-300 text-center mb-6">
          We’re literally building chatbots so you don’t need to fill in contact forms.{" "}
          <span className="text-[#DBAAA7] font-bold">Talk to our AI assistant</span> below… or just try shouting at your screen (it probably won’t work, but we’ll be impressed by your dedication).
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="px-6 py-3 rounded-xl bg-[#202c42] text-[#A8DCAB] font-semibold shadow-md animate-wiggle">
            "Contact forms? That’s so 2023."
          </div>
          <div className="text-gray-400 text-sm italic mt-4 animate-pulse">
            (P.S. The chatbot is always listening... or is it?)
          </div>
        </div>
        {/* Floating chat bubbles for fun */}
        <div className="absolute right-10 top-24 space-y-3 pointer-events-none z-10">
          <div className="bg-[#DBAAA7] px-3 py-1 rounded-2xl shadow animate-float">"Hello, human!"</div>
          <div className="bg-[#A8DCAB] px-3 py-1 rounded-2xl shadow animate-float2">"Need help?"</div>
          <div className="bg-[#202c42] px-3 py-1 rounded-2xl shadow animate-float3 text-[#A8DCAB]">"Just chat below!"</div>
        </div>
      </div>
    </div>
  );
}
