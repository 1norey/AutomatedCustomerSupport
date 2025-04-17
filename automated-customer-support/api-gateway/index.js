// api-gateway/index.js
require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// 🔒 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

// ✅ Auth Service (Port 5000)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/api/auth" },
  })
);

// ✅ Ticket Service (Port 5001)
app.use(
  "/api/tickets",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    pathRewrite: { "^/api/tickets": "/api/tickets" },
  })
);

// ✅ AI Assistant (Port 5001 — handled by ticket-service)
app.use("/api/ai", (req, res, next) => {
  console.log("🔁 Incoming AI request:", req.method, req.url);
  next();
});

app.use(
  "/api/ai",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    pathRewrite: { "^/api/ai": "" }, // removes /api/ai → /try-now handled in ticket-service
  })
);

// 🚀 Start API Gateway
const PORT = process.env.GATEWAY_PORT || 8080;
app.listen(PORT, () => {
  console.log(`🧠 API Gateway running at http://localhost:${PORT}`);
});
