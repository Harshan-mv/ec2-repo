const crypto = require("crypto");

const generateApiKey = () => {
  const random = crypto.randomBytes(32).toString("hex");
  return `sk_test_${random}`;
};

const hashApiKey = (apiKey) => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};

module.exports = {
  generateApiKey,
  hashApiKey
};
