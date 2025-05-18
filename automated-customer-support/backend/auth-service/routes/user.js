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

// Debug: Middleware to show all requests to /users
router.use((req, res, next) => {
  console.log("📍 /users route matched:", req.method, req.originalUrl);
  next();
});

router.get("/test", (req, res) => {
  console.log("✅ /users/test HIT");
  res.json({ message: "✅ /users/test route reached" });
});

router.use((req, res, next) => {
  console.log("✅ userRoutes middleware matched:", req.method, req.originalUrl);
  next();
});


router.get("/", authenticate, (req, res) => {
  console.log("🔥 /users GET matched");
  getUsers(req, res);
});

router.get("", authenticate, (req, res) => {
  console.log("🔥 /users (no slash) GET matched");
  getUsers(req, res);
});



router.put("/:id", authenticate, updateUserRole);
router.delete("/:id", authenticate, deleteUser);

router.put("/me", authenticate, updateSelf);

router.all("*", (req, res) => {
  console.log("⚠️ Route in /users not matched:", req.method, req.originalUrl);
  res.status(404).json({ message: "Route in /users not matched" });
});


module.exports = router;
