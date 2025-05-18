const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Needed for force-verify

const {
  signup,
  login,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// ✅ Signup route (with dev log)
router.post("/signup", (req, res, next) => {
  console.log("🧠 /signup route matched ✅");
  next();
}, signup);

// ✅ Core Auth Routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//  Developer shortcut: Force-verify a user by email
router.get("/force-verify/:email", async (req, res) => {
  console.log("🔧 Force-verify hit:", req.params.email);
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: `✅ ${user.email} verified manually.` });
  } catch (err) {
    res.status(500).json({ message: "Force verification failed", error: err.message });
  }
});


// ✅ Token verification route
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

// ✅ FINAL fallback route – must be very last
router.use((req, res) => {
  console.log("🛑 Route reached but not matched by any handler");
  res.status(404).json({ message: "Route not handled" });
});

module.exports = router;
