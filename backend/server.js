const express = require('express');
require('dotenv').config();



const routes = require('./routes/workouts');

const app = express();

app.use((req, res, next)=>{
    console.log(req.path, req.method);
    next();
})

app.listen(process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`)
});

app.use('/api/workouts', routes);





 