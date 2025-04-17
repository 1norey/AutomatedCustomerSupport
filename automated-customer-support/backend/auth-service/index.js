require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const User = require("./models/User");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./docs/swagger.yaml");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sequelize Initialization
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL successfully");
    return sequelize.sync(); // Create or sync tables
  })
  .then(() => {
    console.log("🛠️ Synced models with DB");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to DB:", err);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
