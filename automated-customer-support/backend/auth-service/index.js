require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ Needed for Refresh Tokens
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./docs/swagger.yaml");
const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000", // or your frontend URL
  credentials: true,               // ✅ Allow credentials (cookies)
}));
app.use(express.json());
app.use(cookieParser());           // ✅ Parse HTTPOnly cookies

app.use((req, res, next) => {
  console.log("📥 Auth Service received:", req.method, req.originalUrl);
  next();
});

// ✅ Routes (expose at root to match gateway pathRewrite)
app.use("/", authRoutes);            // 👈 changed from "/api/auth"
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Database connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    return sequelize.sync({ force: true });
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
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
