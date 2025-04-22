require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// 🛡️ Security Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later.",
}));

// ⚠️ IMPORTANT: Do NOT use `express.json()` here
app.use((req, res, next) => {
  console.log("📥 Incoming request:", req.method, req.originalUrl);
  next();
});


app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" }
  })
);




// 🎟️ Ticket Service Proxy
app.use(
  "/api/tickets",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  })
);

// 🤖 AI Assistant Proxy
app.use(
  "/api/ai",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    pathRewrite: { "^/api/ai": "" },
  })
);

// 🚀 Start Gateway
const PORT = process.env.GATEWAY_PORT || 8080;
app.listen(PORT, () => {
  console.log(`🧠 API Gateway running at http://localhost:${PORT}`);
});
