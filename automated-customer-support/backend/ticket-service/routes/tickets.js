const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const authenticate = require("../middleware/auth");

router.post("/", authenticate, createTicket);
router.get("/", authenticate, getTickets);
router.put("/:id", authenticate, updateTicket);   // ✅ Update
router.delete("/:id", authenticate, deleteTicket); // ❌ Delete

module.exports = router;
