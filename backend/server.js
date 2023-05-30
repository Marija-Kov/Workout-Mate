const express = require('express');
require('dotenv').config();

const cors = require('cors');

const rateLimiters = require("./middleware/rateLimiters")

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/users');
const passwordResetRoutes = require('./routes/resetPassword')

const app = express();
app.use(cors({
  origin: process.env.ORIGIN
}))
app.use(express.json({ limit: "50mb" })); 
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

// app.use((req, res, next)=>{
//     console.log(req.path, req.method);
//     next();
// })
const dbURI =
  process.env.NODE_ENV !== "test"
    ? process.env.MONGO_URI
    : process.env.TEST_MONGO_URI;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    if (process.env.NODE_ENV !== "test"){
        app.listen(process.env.PORT, () => {
        console.log(`connected to db & listening on port ${process.env.PORT}`)
      }); 
    } 
}).catch(err => {
    console.log(`ERROR: ${err}`)
});

app.use('/api/users', rateLimiters.api_users);
app.use('/api/reset-password', rateLimiters.api_reset_password);
app.use("/api/workouts", rateLimiters.api_workouts);

app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reset-password', passwordResetRoutes);

module.exports = app;




 