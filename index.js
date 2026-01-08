require('dotenv').config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send("Hello from AWS EC2 🚀 Node.js is running on https!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("CI/CD test deployment");

});
