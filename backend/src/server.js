const express = require("express");
require("dotenv").config();
const cors = require("cors");
const rateLimiters = require("./middleware/rateLimiters");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
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
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      const port = Number(process.env.PORT) || 6060;
      app.listen(port, () => {
        console.log(`connected to db & listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.log(`ERROR: ${err}`);
    });
}

app.use("/api/users", rateLimiters.api_users);
app.use("/api/reset-password", rateLimiters.api_reset_password);
app.use("/api/workouts", rateLimiters.api_workouts);
app.use("/api/workouts", workoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reset-password", passwordResetRoutes);
app.use(errorHandler);

module.exports = app;
