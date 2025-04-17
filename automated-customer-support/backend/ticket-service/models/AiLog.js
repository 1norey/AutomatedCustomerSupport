const mongoose = require("mongoose");

const aiLogSchema = new mongoose.Schema({
  userId: { type: String },
  role: { type: String, enum: ["admin", "agent", "client"] },
  url: String,
  question: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AiLog", aiLogSchema);
