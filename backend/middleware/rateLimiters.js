const rateLimit = require("express-rate-limit");

module.exports.api_users = rateLimit({
  windowMs: Number(process.env.API_USERS_WINDOW_MS) || 5000,
  max: Number(process.env.MAX_API_USERS_REQS) || 30,
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports.api_reset_password = rateLimit({
  windowMs: Number(process.env.API_RESET_PASSWORD_WINDOW_MS) || 5000,
  max: Number(process.env.MAX_API_RESET_PASSWORD_REQS) || 20,
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports.api_workouts = rateLimit({
  windowMs: Number(process.env.API_WORKOUTS_WINDOW_MS) || 5000,
  max: Number(process.env.MAX_API_WORKOUTS_REQS) || 20,
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
