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

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use((req, res, next) => {
  console.log("📥 Auth Service received:", req.method, req.originalUrl);
  next();
});

const PORT = process.env.AUTH_PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("🛠️ Synced models with DB");
    app.use("/", authRoutes);       // handles /signup, /login, etc.
    console.log("📦 Mounting userRoutes at /users");
    app.use("/users", userRoutes);    
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get("/debug-direct", (req, res) => {
  res.json({ message: "✅ Reached /debug-direct route in auth-service" });
});

    // ❌ 404 fallback
    app.use((req, res) => {
      console.log("🛑 Route reached but not matched by any handler");
      res.status(404).json({ message: "Route not handled" });
    });

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Auth Service running at http://localhost:${PORT}`);
});

  })
  .catch((err) => console.error("❌ DB error:", err));
