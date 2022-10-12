const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');

const routes = require('./routes/workouts');

const app = express();



app.use(express.json());

app.use((req, res, next)=>{
    console.log(req.path, req.method);
    next();
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
 app.listen(process.env.PORT, ()=>{
    console.log(`connected to db & listening on port ${process.env.PORT}`)
});  
}).catch(err => {
    console.log(`ERROR: ${err}`)
});



app.use('/api/workouts/', routes);





 