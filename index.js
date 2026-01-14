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
 * Health endpoint (used by ALB / ASG)
 */
app.get("/health", (req, res) => {
  res
    .status(200)
    .set({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    })
    .send("OK");
});

/**
 * Root endpoint (NO CACHE – HARDENED)
 */
app.get("/", (req, res) => {
  res.set({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store",
  });

  res.send(
    "Hello from AWS EC2 🚀 Node.js 123 f** is running on https try added ssm working all safe !"
  );
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
