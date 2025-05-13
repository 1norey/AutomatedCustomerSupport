require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later.",
}));

app.use((req, res, next) => {
  console.log("📥 Incoming request:", req.method, req.originalUrl);
  next();
});

// Proxy routes
app.use("/api/auth", createProxyMiddleware({
  target: "http://auth-service:5000",
  changeOrigin: true
}));

app.use("/api/tickets", createProxyMiddleware({
  target: "http://ticket-service:5001",
  changeOrigin: true,
}));

app.use("/api/ai", createProxyMiddleware({
  target: "http://ai-service:5002",
  changeOrigin: true,
}));

// Health Check Aggregator
app.get("/services-status", async (req, res) => {
  const services = {
    "auth-service": "http://auth-service:5000/health",
    "ticket-service": "http://ticket-service:5001/health",
    "ai-service": "http://ai-service:5002/health"
  };

  const statusReport = {};
  await Promise.all(
    Object.entries(services).map(async ([name, url]) => {
      try {
        const response = await axios.get(url, { timeout: 1000 });
        statusReport[name] = response.data.status === "ok" ? "online" : "unhealthy";
      } catch {
        statusReport[name] = "offline";
      }
    })
  );

  res.status(200).json(statusReport);
});

// Optional Test
app.get("/test-auth", async (req, res) => {
  try {
    const result = await axios.get("http://auth-service:5000/health");
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ message: "Auth service not reachable", error: err.message });
  }
});

// Start server
const PORT = process.env.GATEWAY_PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🧠 API Gateway running at http://localhost:${PORT}`);
});
