// routes/tickets.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

//  Shared middleware: Inter-service auth check
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  try {
    const response = await axios.post("http://localhost:5000/verify-token", {}, {
      headers: { Authorization: token },
    });

    req.user = response.data.user; // Attach user info for controller use
    next();
  } catch (err) {
    console.error("❌ Auth failed:", err.response?.data || err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

//  Routes with inter-service authentication
router.post("/", authenticate, createTicket);
router.get("/", authenticate, getTickets);
router.put("/:id", authenticate, updateTicket);
router.delete("/:id", authenticate, deleteTicket);

module.exports = router;
