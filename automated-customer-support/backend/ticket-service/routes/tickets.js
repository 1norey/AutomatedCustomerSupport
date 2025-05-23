const express = require("express");
const router = express.Router();
const axios = require("axios");

const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  replyToTicket,
} = require("../controllers/ticketController");

// Inter-service JWT auth middleware (as you have it)
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }
  try {
    const response = await axios.post("http://auth-service:5000/verify-token", {}, { headers: { Authorization: token } });
    req.user = response.data.user; // Attach user info for controller use
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// CRUD routes
router.post("/", authenticate, createTicket);
router.get("/", authenticate, getTickets);
router.patch("/:id/reply", authenticate, replyToTicket); // PATCH for reply
router.put("/:id", authenticate, updateTicket);
router.delete("/:id", authenticate, deleteTicket);

module.exports = router;
