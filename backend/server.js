const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json()); 

app.use((req, res, next)=>{
    console.log(req.path, req.method);
    next();
})

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
 app.listen(process.env.PORT, ()=>{
    console.log(`connected to db & listening on port ${process.env.PORT}`)
});  
}).catch(err => {
    console.log(`ERROR: ${err}`)
});



app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);





 