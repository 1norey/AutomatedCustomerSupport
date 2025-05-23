const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  email:      { type: String, required: true }, // Store user email
  subject:    { type: String, required: true },
  message:    { type: String, required: true },
  answer:     { type: String },                 // Agent/Admin reply
  answeredBy: { type: String },                 // Email/ID of agent/admin
  status:     { type: String, enum: ["open", "answered"], default: "open" },
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
