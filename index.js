require('dotenv').config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

/**
 * Health check endpoint
 * Used by Load Balancer / Auto Scaling / Monitoring
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send("Hello from AWS EC2 🚀 Node.js is running on https!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("CI/CD test deployment - health endpoint enabled");
});
