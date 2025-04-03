import React, { useState } from "react";
import api from "../api/ticketApi";

export default function ContactFallbackForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("http://localhost:5001/api/tickets", {
        ...form,
        status: "open",
        source: "contact",
      });

      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  if (submitted) {
    return <p className="text-green-500 mt-4 text-sm">Your message has been sent. We'll get back to you shortly!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        className="w-full p-2 rounded border border-gray-300"
      />
      <input
        name="email"
        placeholder="Your Email"
        onChange={handleChange}
        className="w-full p-2 rounded border border-gray-300"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        rows="4"
        onChange={handleChange}
        className="w-full p-2 rounded border border-gray-300"
      />
      <button
        type="submit"
        className="bg-[#DBAAA7] text-black font-bold py-2 px-4 rounded hover:bg-[#c99390] transition"
      >
        Send Message
      </button>
    </form>
  );
}
