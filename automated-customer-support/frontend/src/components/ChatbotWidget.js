import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

export default function ChatbotWidget({ onFallback }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", text: "Hey there! I'm here to help with AutoSupport AI." },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    // Simulated bot logic
    setTimeout(() => {
      if (message.toLowerCase().includes("price") || message.toLowerCase().includes("pricing")) {
        setChat((prev) => [...prev, { sender: "bot", text: "Our pricing starts at $29/month. Want a custom plan?" }]);
      } else {
        setChat((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Hmm, I might need a human for this. Want to send a message to our team?",
          },
        ]);
        onFallback(); // show fallback form
      }
    }, 1000);

    setMessage("");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!open ? (
          <button
            className="bg-[#519755] p-4 rounded-full shadow-lg hover:bg-[#407743] transition"
            onClick={() => setOpen(true)}
          >
            <FaRobot size={24} className="text-white" />
          </button>
        ) : (
          <div className="w-80 h-[400px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border-2 border-[#A8DCAB]">
            <div className="flex justify-between items-center p-3 bg-[#A8DCAB] text-[#1a1a1a] font-bold">
              <span>AutoSupport Chat</span>
              <FaTimes className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>

            <div className="flex-1 px-3 py-2 overflow-y-auto bg-gray-50 space-y-2 text-sm">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "ml-auto bg-[#DBAAA7] text-black"
                      : "bg-[#A8DCAB] text-black"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none text-sm"
                placeholder="Type your message..."
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
