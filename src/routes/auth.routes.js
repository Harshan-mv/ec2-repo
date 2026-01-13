const express = require("express");
const User = require("../models/User");
const ApiKey = require("../models/ApiKey");
const Plan = require("../models/Plan");
const { generateApiKey, hashApiKey } = require("../services/key.service");

const router = express.Router();

/**
 * POST /auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await User.create({ email });
    res.status(201).json({
      message: "User registered",
      user_id: user._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /auth/apikey
 */
router.post("/apikey", async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const plan = await Plan.findOne({ name: "FREE" });
    if (!plan) {
      return res.status(500).json({ error: "Default plan missing" });
    }

    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);

    await ApiKey.create({
      keyHash,
      user: user._id,
      plan: plan._id
    });

    // IMPORTANT: return raw key only once
    res.status(201).json({
      api_key: apiKey,
      plan: plan.name,
      rate_limit_per_min: plan.rateLimitPerMinute
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
