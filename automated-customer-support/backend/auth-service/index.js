require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL successfully");
    return sequelize.sync(); // create tables
  })
  .then(() => {
    console.log("🛠️ Synced models with DB");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to DB:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
