import React, { useState, useRef, useEffect } from "react";
import axios from "../api/aiApi";

export default function TryNow() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!url || !question) {
      setError("Please enter both a website URL and a question.");
      return;
    }

    const userMsg = { type: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    console.log("📤 Sending request to AI:", { url, question });

    try {
      const res = await axios.post("/ai/try-now", { url, question });
      console.log("✅ Received AI response:", res.data);
      const botMsg = { type: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("❌ Error in AI response:", err.message);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] min-h-screen text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-[#A8DCAB] mb-4 text-center">💬 Try AutoSupport AI</h1>
        <p className="text-center text-gray-400 mb-8">
          Paste a website URL and ask a question to get AI-generated answers based on real site content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#519755]"
          />
          <input
            type="text"
            placeholder="What would you like to know?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#519755]"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#DBAAA7] hover:bg-[#c98686] text-black font-bold py-3 rounded transition-all"
          >
            Ask AI
          </button>
        </form>

        <div className="mt-10 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap ${
                msg.type === "user"
                  ? "bg-[#A8DCAB] text-black self-end ml-auto"
                  : "bg-white/10 text-white self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-400 animate-pulse self-start">🤖 Responding...</div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
