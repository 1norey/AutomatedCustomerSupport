const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("🔒 [AUTH] No Authorization header sent");
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("🔒 [AUTH] Authorization header present but no token found:", authHeader);
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ [AUTH] Token valid for user:", decoded.email || decoded.id || "unknown");
    next();
  } catch (err) {
    console.log("❌ [AUTH] Invalid token:", token, "Error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
