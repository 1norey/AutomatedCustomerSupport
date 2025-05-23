const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  getUsers,
  updateUserRole,
  deleteUser,
  updateSelf
} = require("../controllers/userController");

console.log("✅ userRoutes file loaded");

router.get("/debug", (req, res) => {
  res.json({ message: "✅ /users/debug reached (no auth)" });
});

router.get("/test", (req, res) => {
  res.json({ message: "✅ /users/test reached (no auth)" });
});

router.get("/", authenticate, getUsers); // this uses your real getUsers controller


router.put("/:id", authenticate, updateUserRole);
router.delete("/:id", authenticate, deleteUser);
router.put("/me", authenticate, updateSelf);

module.exports = router;
