const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const { getUsers, updateUserRole, deleteUser, updateSelf } = require("../controllers/userController");

// Admin routes
router.get("/", authenticate, getUsers);
router.put("/:id", authenticate, updateUserRole);
router.delete("/:id", authenticate, deleteUser);

// Self-service route
router.put("/me", authenticate, updateSelf);

module.exports = router;
