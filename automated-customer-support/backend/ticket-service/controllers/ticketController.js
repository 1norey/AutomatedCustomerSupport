const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({
      userId: req.user.id,
      subject,
      message
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to create ticket", error: err.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets", error: err.message });
  }
};


const updateTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        req.body,
        { new: true }
      );
  
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ message: "Failed to update ticket", error: err.message });
    }
  };
  
  const deleteTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findOneAndDelete({ _id: id, userId: req.user.id });
  
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });
      res.json({ message: "Ticket deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete ticket", error: err.message });
    }
  };

  module.exports = { createTicket, getTickets, updateTicket, deleteTicket};
  
