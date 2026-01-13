const Plan = require("../models/Plan");

const seedPlans = async () => {
  const freePlanExists = await Plan.findOne({ name: "FREE" });

  if (!freePlanExists) {
    await Plan.create({
      name: "FREE",
      rateLimitPerMinute: 10,
      dailyQuota: 1000
    });
    console.log("FREE plan seeded");
  }
};

module.exports = seedPlans;
