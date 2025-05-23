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

app.use((req, res, next) => {
  console.log("🌐 Gateway received:", req.method, req.originalUrl);
  next();
});

app.use("/api/auth", createProxyMiddleware({
  target: "http://auth-service:5000",
  changeOrigin: true,
  pathRewrite: { "^/api/auth": "" },
  // Debug log:
  onProxyReq: (proxyReq, req, res) => {
    console.log("➡️ Forwarding to:", "http://auth-service:5000" + req.originalUrl.replace(/^\/api\/auth/, ''));
  }
}));



 //Proxy everything under /api/auth directly to auth-service
app.use("/api/ai", createProxyMiddleware({
  target: "http://ticket-service:5001",
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // Print exactly what will be proxied
    const rewritten = "/api/ai" + path.replace(/^\/api\/ai/, "");
    console.log("Proxy forwarding path:", rewritten);
    return rewritten;
  },
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error("AI Service Proxy Error:", err);
    res.status(503).json({ message: "AI service unavailable" });
  }
}));

// Tickets
app.use(
  "/api/tickets",
  createProxyMiddleware({
    target: "http://ticket-service:5001",
    changeOrigin: true,
     pathRewrite: { "^/api/tickets": "/api/tickets" }
  })
);


// Health aggregator
app.get("/services-status", async (req, res) => {
  const services = {
    "auth-service": "http://auth-service:5000/health",
    "ticket-service": "http://ticket-service:5001/health"
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

app.use((req, res, next) => {
  console.log("⛔️ Unmatched request in Gateway:", req.method, req.originalUrl);
  res.status(404).send("Gateway did not match any route");
});


// Start server
const PORT = process.env.GATEWAY_PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🧠 API Gateway running at http://localhost:${PORT}`);
});
