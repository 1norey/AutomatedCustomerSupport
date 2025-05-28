import React from "react";
import Sidebar from "../components/SideBar";
import { FaRobot, FaReact, FaNodeJs, FaDatabase, FaEnvelope } from "react-icons/fa";

export default function About() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 flex flex-1 p-10 min-h-screen bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e]">
        {/* Left: About text */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[#A8DCAB] mb-4">About AutoSupport AI</h1>
          <p className="text-lg max-w-2xl text-gray-300">
            AutoSupport AI is a next-generation platform that automates customer service using powerful machine learning and natural language processing.
            Our mission is to empower businesses of all sizes to offer fast, intelligent, and personalized support without the high cost.
          </p>
          <p className="mt-6 text-gray-400">
            Whether you're a startup, agency, or global enterprise — our solution grows with you.
          </p>
        </div>

        {/* Right: Animated AI Card */}
        <div className="w-[380px] flex flex-col items-center justify-center ml-12">
          {/* AI Avatar - animated ring */}
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute animate-spin-slow rounded-full h-28 w-28 border-t-4 border-[#A8DCAB] border-dashed opacity-60"></div>
            <div className="rounded-full bg-[#202c42] h-24 w-24 flex items-center justify-center shadow-xl border-4 border-[#A8DCAB]">
              <FaRobot className="text-6xl text-[#A8DCAB] drop-shadow-lg" />
            </div>
          </div>
          {/* Team/Tech Card */}
          <div className="bg-[#181926] p-6 rounded-xl shadow-lg border border-[#A8DCAB]/20 w-full">
            <h2 className="text-2xl font-semibold text-[#A8DCAB] mb-2 flex items-center gap-2">
              <FaRobot /> Meet Your AI
            </h2>
            <p className="text-gray-300 mb-2">
              Driven by the latest in AI, powered by: 
            </p>
            <div className="flex space-x-4 mb-3 text-2xl">
              <FaReact className="text-blue-400" title="React.js" />
              <FaNodeJs className="text-green-500" title="Node.js" />
              <FaDatabase className="text-gray-400" title="MongoDB/Postgres" />
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Smart. Scalable. Secure.<br/>
              Always learning to serve you better!
            </p>
            <div className="flex items-center gap-2 text-[#DBAAA7]">
              <FaEnvelope />
              <span className="text-xs">support@autosupportai.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// You may add to tailwind.config.js for custom animation:
/// theme: {
///   extend: {
///     animation: {
///       'spin-slow': 'spin 3s linear infinite',
///     }
///   }
/// }
