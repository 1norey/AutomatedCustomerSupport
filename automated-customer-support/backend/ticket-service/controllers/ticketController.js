const Ticket = require("../models/Ticket");
const nodemailer = require("nodemailer");

// Nodemailer transporter using Outlook/Office365 SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Always false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Helper function for sending email via Outlook
async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}

// Create ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const email = req.user.email; // Auth microservice must provide email in JWT
    const ticket = await Ticket.create({
      userId: req.user.id,
      email,
      subject,
      message,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to create ticket", error: err.message });
  }
};

// Get tickets (admin/agent: all, user: own)
exports.getTickets = async (req, res) => {
  try {
    let query = {};
    if (!["admin", "agent"].includes(req.user.role)) {
      query.userId = req.user.id;
    }
    if (req.query.status) query.status = req.query.status;
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets", error: err.message });
  }
};

// Agent/Admin reply to ticket + send Outlook email


exports.replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.status === "answered") return res.status(400).json({ message: "Already answered" });

    ticket.answer = answer;
    ticket.answeredBy = req.user.email || req.user.id;
    ticket.status = "answered";
    await ticket.save();

    // Send answer to user's email via Outlook
    await sendEmail(
      ticket.email,
      "Your Support Ticket Has Been Answered",
      `Hello,\n\nYour question:\n${ticket.message}\n\nAgent reply:\n${answer}\n\nBest regards,\nSupport Team`
    );

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to reply", error: err.message });
  }
};

// Update ticket (e.g., reopen)
exports.updateTicket = async (req, res) => {
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
    res.status(500).json({ message: "Failed to update ticket", error: err.message });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
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
    res.status(500).json({ message: "Failed to delete ticket", error: err.message });
  }
};
