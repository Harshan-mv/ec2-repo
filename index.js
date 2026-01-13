require("dotenv").config();
const express = require("express");

const connectMongo = require("./src/config/mongo");
const redis = require("./src/config/redis");
const seedPlans = require("./src/utils/seedPlans");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);

/**
 * Health endpoint (unchanged)
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Root endpoint (unchanged)
 */
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send("Hello from AWS EC2 🚀 Node.js is running on https!");
});

/**
 * Start server AFTER DB connection
 */
const startServer = async () => {
  await connectMongo();
  await seedPlans();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("CI/CD test deployment - health endpoint enabled");
  });
};

startServer();
