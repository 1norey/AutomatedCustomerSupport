require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const ticketRoutes = require("./routes/tickets");
const aiRoutes = require("./routes/ai");
const { connectRabbitMQ } = require("./utils/rabbitmq");

const app = express();

// ✅ Load Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

// ✅ Security & Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("📥 Ticket Service received:", req.method, req.originalUrl);
  next();
});

// ✅ Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", aiRoutes);

// ✅ Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Start App
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await connectRabbitMQ();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🎟️ Ticket Service running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
