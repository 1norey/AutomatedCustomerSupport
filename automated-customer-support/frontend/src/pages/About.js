import React from "react";
import Sidebar from "../components/SideBar";

export default function About() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 p-10 text-white min-h-screen bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e]">
        <h1 className="text-4xl font-bold text-[#A8DCAB] mb-4">About AutoSupport AI</h1>
        <p className="text-lg max-w-2xl text-gray-300">
          AutoSupport AI is a next-generation platform that automates customer service using powerful machine learning and natural language processing.
          Our mission is to empower businesses of all sizes to offer fast, intelligent, and personalized support without the high cost.
        </p>
        <p className="mt-6 text-gray-400">
          Whether you're a startup, agency, or global enterprise — our solution grows with you.
        </p>
      </div>
    </div>
  );
}
