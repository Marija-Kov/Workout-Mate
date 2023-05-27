const rateLimit = require("express-rate-limit");

module.exports.api_users = rateLimit({
  windowMs: 600000,
  max: 10,
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports.api_reset_password = rateLimit({
  windowMs: 600000,
  max: 5,
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports.api_workouts = rateLimit({
  windowMs: 600000,
  max: 100,
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

