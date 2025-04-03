const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "in progress", "resolved"],
    default: "open",
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Ticket", TicketSchema);
