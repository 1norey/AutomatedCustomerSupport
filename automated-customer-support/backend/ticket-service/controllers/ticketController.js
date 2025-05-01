const Ticket = require("../models/Ticket");

// 📌 Create Ticket — userId from authenticated token
const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({
      userId: req.user.id, // Set by inter-service auth
      subject,
      message,
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error("❌ Create failed:", err);
    res.status(500).json({ message: "Failed to create ticket", error: err.message });
  }
};

// 📌 Get Tickets — all for admin/agent, own for client
const getTickets = async (req, res) => {
  try {
    let tickets;
    if (["admin", "agent"].includes(req.user.role)) {
      tickets = await Ticket.find();
    } else {
      tickets = await Ticket.find({ userId: req.user.id });
    }
    res.status(200).json(tickets);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    res.status(500).json({ message: "Failed to fetch tickets", error: err.message });
  }
};

// 📌 Update Ticket — only owner or admin/agent
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Access control
    if (
      ticket.userId !== req.user.id &&
      !["admin", "agent"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not allowed to update this ticket" });
    }

    Object.assign(ticket, req.body);
    const updated = await ticket.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ message: "Failed to update ticket", error: err.message });
  }
};

// 📌 Delete Ticket — only owner or admin/agent
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Access control
    if (
      ticket.userId !== req.user.id &&
      !["admin", "agent"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not allowed to delete this ticket" });
    }

    await Ticket.findByIdAndDelete(id);
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ message: "Failed to delete ticket", error: err.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
};
