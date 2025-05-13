// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  signup,
  login,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/signup", (req, res, next) => {
  console.log("🧠 /signup route matched ✅");
  next();
}, signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.use((req, res) => {
  console.log("🛑 Route reached but not matched by any handler");
  res.status(404).json({ message: "Route not handled" });
});


module.exports = router;
