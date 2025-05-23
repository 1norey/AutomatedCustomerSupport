import React, { useState, useRef, useEffect } from "react";
import axios from "../api/aiApi";
import ticketApi from "../api/ticketApi";
import { FaRobot, FaSpinner, FaRegEnvelope } from "react-icons/fa";

export default function TryNow() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm AutoSupport AI. Ask me anything about a website by providing its URL and your question."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const bottomRef = useRef(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

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

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const userMsg = {
      type: "user",
      text: question,
      meta: { url }
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(
        "/ai/try-now",
        { url, question },
        { timeout: 30000 }
      );

      const botMsg = {
        type: "bot",
        text: res.data.response || "I couldn't generate a response.",
        meta: { url }
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      let errorMessage = "⚠️ Something went wrong. Please try again.";
      if (err.code === "ECONNABORTED") {
        errorMessage = "The request timed out. Please try a smaller website or simpler question.";
      } else if (err.response?.status === 504) {
        errorMessage = "The AI service is currently unavailable. Please try again later.";
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: errorMessage,
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  // Determine if the last bot response was "unsatisfactory"
  const isLastBotMsgUnsatisfactory = (() => {
    if (messages.length < 2) return false;
    const last = messages[messages.length - 1];
    return (
      last.type === "bot" &&
      (last.text.toLowerCase().includes("couldn't") ||
        last.text.toLowerCase().includes("not able") ||
        last.isError)
    );
  })();

  // Ticket Form Handlers
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      await ticketApi.post("", {
        subject: ticketSubject || "Support Request from AI Chat",
        message: ticketMessage || messages[messages.length - 2]?.text || "No message provided",
      });
      setTicketSubmitted(true);
      setShowAgentForm(false);
      setTicketSubject("");
      setTicketMessage("");
    } catch {
      alert("Failed to submit ticket. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] min-h-screen text-white p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FaRobot className="text-3xl text-[#A8DCAB]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#A8DCAB] text-center">
            Try AutoSupport AI
          </h1>
        </div>

        <p className="text-center text-gray-400 mb-8 text-sm md:text-base">
          Paste any website URL and ask questions to get instant AI-powered answers based on the site's content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300">
              Website URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#519755] placeholder-gray-500"
              required
              pattern="https?://.+"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="question" className="block text-sm font-medium text-gray-300">
              Your Question
            </label>
            <input
              id="question"
              type="text"
              placeholder="What would you like to know about this website?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#519755] placeholder-gray-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#DBAAA7] hover:bg-[#c98686] text-black font-bold py-3 px-4 rounded-lg transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              "Ask AI"
            )}
          </button>
        </form>

        {/* Ticket Success Message */}
        {ticketSubmitted && (
          <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg mb-4 text-green-300">
            Your ticket was submitted! An agent will reply to your email.
          </div>
        )}

        {/* Ask an Agent UI (inline after a bad answer) */}
        {isLastBotMsgUnsatisfactory && !showAgentForm && !ticketSubmitted && (
          <div className="my-4 flex flex-col items-center">
            <p className="text-yellow-300 mb-2">Didn’t get the answer you need?</p>
            {user ? (
              <button
                onClick={() => setShowAgentForm(true)}
                className="bg-[#A8DCAB] text-black px-4 py-2 rounded font-semibold hover:bg-[#85b98d]"
              >
                Ask an Agent
              </button>
            ) : (
              <p className="text-red-400">Please log in to contact an agent.</p>
            )}
          </div>
        )}

        {showAgentForm && (
          <form
            onSubmit={handleTicketSubmit}
            className="space-y-3 bg-white/10 border border-white/20 rounded-lg p-4 mb-4"
          >
            <h3 className="text-lg font-semibold text-[#A8DCAB]">Contact a Human Agent</h3>
            <input
              type="text"
              placeholder="Subject"
              value={ticketSubject}
              onChange={e => setTicketSubject(e.target.value)}
              className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
            />
            <textarea
              placeholder="Describe your issue"
              value={ticketMessage}
              onChange={e => setTicketMessage(e.target.value)}
              className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
              rows={4}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#DBAAA7] text-black px-4 py-2 rounded font-semibold hover:bg-[#c98686]"
              >
                Submit Ticket
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setShowAgentForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Conversation History</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl text-sm whitespace-pre-wrap ${
                  msg.type === "user"
                    ? "bg-[#A8DCAB]/20 border border-[#A8DCAB]/30 text-[#A8DCAB] self-end ml-auto"
                    : msg.isError
                      ? "bg-red-900/20 border border-red-700/30 text-red-300"
                      : "bg-white/5 border border-white/10 text-white"
                }`}
              >
                {msg.meta?.url && (
                  <p className="text-xs opacity-70 mb-1 truncate">
                    {msg.meta.url}
                  </p>
                )}
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 p-4 text-sm text-gray-400">
                <FaSpinner className="animate-spin" />
                <span>Analyzing website content and generating response...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Always visible floating Ask an Agent button (bottom-right) */}
      {user && !showAgentForm && !ticketSubmitted && (
        <button
          onClick={() => setShowAgentForm(true)}
          className="fixed z-50 bottom-6 right-6 p-4 rounded-full bg-gradient-to-br from-[#A8DCAB] to-[#519755] text-black font-bold shadow-lg border-4 border-[#DBAAA7] transition-all duration-300 
          animate-pulse-glow hover:scale-110 hover:from-[#DBAAA7] hover:to-[#A8DCAB] hover:text-white hover:shadow-2xl flex items-center gap-2"
          style={{
            fontSize: '1.1rem',
            letterSpacing: '0.01em'
          }}
        >
          <FaRegEnvelope className="text-lg" />
          Ask an Agent
        </button>
      )}
    </div>
  );
}
