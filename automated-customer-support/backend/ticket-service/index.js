require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Redis Client (Docker-optimized)
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 200, 5000)
  }
});

redisClient.on("error", (err) =>
  console.error(`[Redis Error] ${err.code === "ECONNREFUSED" ? "Connection refused" : err.message}`)
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Database and Redis Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[Ticket-Service] ✅ MongoDB connected");
    
    await redisClient.connect();
    console.log("[Ticket-Service] ✅ Redis connected");
    
    // Initialize quota with 24h expiry
    await redisClient.set(
      "openai:quota_remaining",
      process.env.FREE_QUOTA_LIMIT,
      { EX: 86400 }
    );
    console.log("[Ticket-Service] ✅ Quota initialized:", process.env.FREE_QUOTA_LIMIT);

  } catch (err) {
    console.error("[Ticket-Service] ❌ DB connection failed:", err.message);
    process.exit(1);
  }
};

// Start the app only after DB and Redis are connected
connectDB().then(() => {
  // Register routes
  app.use("/api/ai", require("./routes/ai")(redisClient));

  app.use((req, res, next) => {
  console.log(`[Ticket-Service] Incoming:`, req.method, req.originalUrl);
  next();
});


  app.use("/", require("./routes/tickets"));

  // Health Check route
  app.get("/health", async (req, res) => {
    res.json({
      status: "ok",
      redis: await redisClient.ping().then(() => "up").catch(() => "down"),
      mongo: mongoose.connection.readyState === 1 ? "up" : "down"
    });
  });

  // Start server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`[Ticket-Service] 🚀 Running on port ${PORT}`);
    console.log(`[Ticket-Service] 🤖 OpenAI quota: ${process.env.FREE_QUOTA_LIMIT} tokens`);
  });
});

module.exports = app;
