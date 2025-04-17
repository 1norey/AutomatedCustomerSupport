// ticket-service/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const ticketRoutes = require("./routes/tickets");
const aiRoutes = require("./routes/ai");

console.log("🧠 AI routes loaded");

const app = express();

// Load Swagger YAML
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", aiRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5001, () => {
      console.log(`🎟️ Ticket Service running on port ${process.env.PORT || 5001}`);
      console.log(`📚 Swagger Docs available at http://localhost:${process.env.PORT || 5001}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
