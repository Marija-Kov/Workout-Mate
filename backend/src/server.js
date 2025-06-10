const express = require("express");
require("dotenv").config();
const cors = require("cors");
const rateLimiters = require("./middleware/rateLimiters");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/users");
const passwordResetRoutes = require("./routes/resetPassword");
const { errorHandler } = require("./error/error");
const cookieParser = require("cookie-parser");
const { prototype } = require("nodemailer/lib/dkim");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

if (process.env.NODE_ENV !== "test") {
  app.use("/api/users", rateLimiters.api_users);
  app.use("/api/reset-password", rateLimiters.api_reset_password);
  app.use("/api/workouts", rateLimiters.api_workouts);
}
 
app.use("/api/workouts", workoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reset-password", passwordResetRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT) || 6060;
  try {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  } catch (error) {
    console.log(`ERROR: ${error}`)
  }
}

module.exports = app;
