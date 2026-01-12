const Redis = require("ioredis");

let redis = null;

if (process.env.REDIS_ENABLED === "true") {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      if (times > 3) return null; // stop retrying
      return 2000;
    }
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
  });
} else {
  console.log("Redis disabled (local dev)");
}

module.exports = redis;
