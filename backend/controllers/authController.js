const User = require('../models/userModel');
const mongoose = require('mongoose');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: '', password:'' };

  if(err.message.includes('User validation failed')){
    Object.values(err.errors).forEach(e => {  // by extracting ({properties}) here...
        let errorsProperty = e.properties.path; // you could simplify the next couple of lines
        errors[errorsProperty] = e.properties.message;
    })
  } else if(err.code === 11000){
      errors.username = "That username already exists. Please enter a different one."
  }
  return errors
}

module.exports.signup_get = (req, res) => {
    res.json({render: "signup get"})
}

module.exports.login_get = (req, res) => {
    res.json({render: "login get"})
}

module.exports.signup_post = async (req, res) => {
 const {username, password} = req.body;
     try {
 const user = await User.create({username, password});
   res.status(200).json(user);
   console.log(user)
  } catch(err){
   const errors = handleErrors(err);
   res.status(400).json({errors});
  }
}

module.exports.login_post = (req, res) => {
    res.send('user login')
}