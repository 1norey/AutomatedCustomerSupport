require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./docs/swagger.yaml");
const app = express();

// ✅ Security & Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("📥 Auth Service received:", req.method, req.originalUrl);
  next();
});

// ✅ Routes
app.use("/", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ PostgreSQL Connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    return sequelize.sync();
  })
  .then(() => {
    console.log("🛠️ Synced models with DB");
  })
  .catch((err) => {
    console.error("❌ DB error:", err);
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs at http://localhost:${PORT}/api-docs`);
});
