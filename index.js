require("dotenv").config();

const express = require("express");

const connectMongo = require("./src/config/mongo");
const connectRedis = require("./src/config/redis");
const seedPlans = require("./src/utils/seedPlans");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);

/**
 * Health endpoint (ALB / ASG safe)
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Root endpoint (no cache)
 */
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.send("Hello from AWS EC2 🚀 Node.js is running on HTTPS (ASG-safe)");
});

/**
 * Start server FIRST (critical for ASG)
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  /**
   * Mongo init (NON-BLOCKING)
   */
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing — skipping Mongo connection");
  } else {
    connectMongo()
      .then(() => {
        console.log("✅ MongoDB connected");
        return seedPlans();
      })
      .then(() => console.log("✅ Seed completed"))
      .catch(err => {
        console.error("❌ Mongo init failed:", err.message);
      });
  }

  /**
   * Redis init (NON-BLOCKING)
   */
  if (!process.env.REDIS_URL) {
    console.warn("⚠️ REDIS_URL not set — Redis disabled");
  } else {
    connectRedis()
      .then(() => console.log("✅ Redis connected"))
      .catch(err => console.error("❌ Redis failed:", err.message));
  }
});
