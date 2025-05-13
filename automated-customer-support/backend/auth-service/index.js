require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const swaggerDocument = YAML.load("./docs/swagger.yaml");

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health route — safe to expose always
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log("📥 Auth Service received:", req.method, req.originalUrl);
  next();
});

// ✅ Server Port
const PORT = process.env.AUTH_PORT || process.env.PORT || 5000;

// Connect to DB and only then mount routes + start server
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("🛠️ Synced models with DB");

    // ✅ Mount routes after DB is ready
    app.use("/", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // ✅ Start the server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
      console.log(`📚 Swagger Docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ DB error:", err);
  });
