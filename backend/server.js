const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/users');
const passwordResetRoutes = require('./routes/resetPassword')

const app = express();

app.use(express.json({ limit: "50mb" })); 
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use((req, res, next)=>{
    console.log(req.path, req.method);
    next();
})

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    if (process.env.NODE_ENV !== "test"){
        app.listen(process.env.PORT, () => {
        console.log(`connected to db & listening on port ${process.env.PORT}`)
      }); 
    } 
}).catch(err => {
    console.log(`ERROR: ${err}`)
});



app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reset-password', passwordResetRoutes);

module.exports = app;




 