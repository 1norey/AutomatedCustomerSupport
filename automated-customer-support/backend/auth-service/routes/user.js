const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

router.get("/", authenticate, getUsers);
router.put("/:id", authenticate, updateUserRole);
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
