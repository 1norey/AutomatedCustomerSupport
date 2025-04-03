import React, { useEffect, useState } from "react";
import ticketApi from "../api/ticketApi"; // ✅ clear and specific

export default function TicketManager() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await ticketApi.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ticketApi.put(`/tickets/${id}`, { status: newStatus });
      fetchTickets();
    } catch {
      alert("Failed to update ticket");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await ticketApi.delete(`/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete ticket");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p className="text-white">Loading tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white/5 border border-white/20 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl text-[#A8DCAB] font-bold mb-4">Support Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-400">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white/10 p-4 rounded border border-white/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-semibold">{ticket.subject || ticket.name}</p>
                  <p className="text-sm text-gray-400">{ticket.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    From: {ticket.email || "userId: " + ticket.userId}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                    className="bg-[#A8DCAB] text-black text-sm px-2 py-1 rounded"
                  >
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => handleDelete(ticket._id)}
                    className="text-sm text-[#DBAAA7] hover:text-red-500"
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
