const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { signup, login, refreshToken } = require("../controllers/authController");

//  Existing routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

//  Inter-service token verification
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

module.exports = router;
