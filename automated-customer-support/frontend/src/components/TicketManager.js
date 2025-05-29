import React, { useEffect, useState } from "react";
import ticketApi from "../api/ticketApi";

export default function TicketManager() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      const params = filter === "all" ? {} : { status: filter === "open" ? "open" : "answered" };
      const res = await ticketApi.get("/", { params });
      setTickets(res.data);
    } catch (err) {
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line
  }, [filter]);

  const handleReply = async (id) => {
    if (!replyText[id]) return;
    try {
      await ticketApi.patch(`/${id}/reply`, { answer: replyText[id] });
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      fetchTickets();
      alert("Reply sent to user by email!");
    } catch {
      alert("Failed to send reply");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
        await ticketApi.delete(`/${id}`);
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete ticket");
    }
  };

  if (loading) return <p className="text-white">Loading tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white/5 border border-white/20 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl text-[#A8DCAB] font-bold mb-4">Support Tickets</h2>
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}
                className="bg-[#A8DCAB] text-black rounded px-2 py-1">
          <option value="all">All</option>
          <option value="open">Not Answered</option>
          <option value="answered">Answered</option>
        </select>
      </div>
      {tickets.length === 0 ? (
        <p className="text-gray-400">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white/10 p-4 rounded border border-white/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-semibold">{ticket.subject}</p>
                  <p className="text-sm text-gray-400">{ticket.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    From: {ticket.email}
                  </p>
                  {ticket.status === "answered" && (
                    <div className="mt-2 p-2 bg-green-900/20 rounded text-green-300">
                      <strong>Agent Reply:</strong> {ticket.answer}
                    </div>
                  )}
                  {ticket.status === "open" && (
                    <form onSubmit={e => {e.preventDefault(); handleReply(ticket._id);}} className="mt-2 flex flex-col">
                      <textarea
                        value={replyText[ticket._id] || ""}
                        onChange={e =>
                          setReplyText(prev => ({ ...prev, [ticket._id]: e.target.value }))
                        }
                        placeholder="Type your reply here..."
                        className="rounded p-2 mb-2 text-black"
                        required
                      />
                      <button type="submit"
                        className="bg-[#DBAAA7] text-black rounded px-3 py-1 self-end"
                      >
                        Send Reply
                      </button>
                    </form>
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    className="text-sm text-[#DBAAA7] hover:text-red-500 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
