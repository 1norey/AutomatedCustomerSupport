require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ✅ Middleware
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

// ✅ Proxies
app.use("/api/auth", createProxyMiddleware({
  target: "http://localhost:5000",
  changeOrigin: true,
  pathRewrite: { "^/api/auth": "" },
}));

app.use("/api/tickets", createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true,
}));

app.use("/api/ai", createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
  pathRewrite: { "^/api/ai": "" },
}));

// ✅ Microservice health aggregator
app.get("/services-status", async (req, res) => {
  const services = {
    "auth-service": "http://localhost:5000/health",
    "ticket-service": "http://localhost:5001/health",
    "ai-service": "http://localhost:5002/health"
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

// ✅ Start Gateway
const PORT = process.env.GATEWAY_PORT || 8080;
app.listen(PORT, () => {
  console.log(`🧠 API Gateway running at http://localhost:${PORT}`);
});
