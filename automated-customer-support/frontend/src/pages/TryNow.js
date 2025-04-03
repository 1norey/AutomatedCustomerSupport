import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import ChatbotWidget from "../components/ChatbotWidget";
import ContactFallbackForm from "../components/ContactFallbackForm";

export default function TryNow() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Page Content */}
      <div className="ml-56 w-full p-10 min-h-screen bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] text-white relative">
        <h1 className="text-4xl font-bold text-[#A8DCAB] mb-4">Try Our AI Chatbot</h1>
        <p className="text-gray-300 max-w-2xl mb-6">
          Interact with our smart assistant just like your customers would.
          Ask it anything about our product — or enter your own website to test real-world behavior.
        </p>

        {/* 🧪 Future: URL Input Demo */}
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm text-[#A8DCAB] font-semibold mb-2">
            Paste a website URL (demo feature coming soon)
          </label>
          <input
            type="text"
            id="url"
            placeholder="https://example.com"
            disabled
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none"
          />
        </div>

        {/* ⛑️ Fallback Form (shown if chatbot can’t help) */}
        {showForm && (
          <div className="bg-white/10 p-6 rounded-lg border border-white/20 max-w-lg mt-10">
            <h3 className="text-[#DBAAA7] text-xl font-semibold mb-2">Didn't find what you needed?</h3>
            <p className="text-sm text-gray-300 mb-4">
              Fill out the form and a support agent will get back to you.
            </p>
            <ContactFallbackForm />
          </div>
        )}

        {/* 🤖 Floating Chatbot Widget (bottom-right) */}
        <ChatbotWidget onFallback={() => setShowForm(true)} />
      </div>
    </div>
  );
}
