const Redis = require("ioredis");

let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on("connect", () => console.log("Redis connected"));
} else {
  console.warn("REDIS_URL not set — Redis disabled");
}

module.exports = redis;
