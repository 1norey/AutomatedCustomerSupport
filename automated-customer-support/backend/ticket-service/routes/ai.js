const express = require("express");
const router = express.Router();
const { tryNow } = require("../controllers/aiController");

console.log("🧠 AI routes loaded");

router.post("/try-now", (req, res, next) => {
  console.log("📨 /try-now route hit");
  next();
}, tryNow);

module.exports = router;
