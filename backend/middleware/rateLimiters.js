const rateLimit = require("express-rate-limit");

module.exports.api_users = rateLimit({
  windowMs:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.API_USERS_WINDOW_MS)
      : Number(process.env.TEST_API_USERS_WINDOW_MS),
  max:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_API_USERS_REQS)
      : Number(process.env.TEST_MAX_API_USERS_REQS),
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports.api_reset_password = rateLimit({
  windowMs:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.API_RESET_PASSWORD_WINDOW_MS)
      : Number(process.env.TEST_API_RESET_PASSWORD_WINDOW_MS),
  max:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_API_RESET_PASSWORD_REQS)
      : Number(process.env.TEST_MAX_API_RESET_PASSWORD_REQS),
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports.api_workouts = rateLimit({
  windowMs:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.API_WORKOUTS_WINDOW_MS)
      : Number(process.env.TEST_API_WORKOUTS_WINDOW_MS),
  max:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_API_WORKOUTS_REQS)
      : Number(process.env.TEST_MAX_API_WORKOUTS_REQS),
  message: async (req, res) => {
    res.status(429).json({ error: "Too many requests. Please try later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

