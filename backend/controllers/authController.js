const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const handleErrors = (err) => {
  let errors = { username: '', password:'' };

  if(err.message.includes('User validation failed')){
    Object.values(err.errors).forEach(e => {  // by extracting ({properties}) here...
        let errorsProperty = e.properties.path; // you could simplify the next couple of lines
        errors[errorsProperty] = e.properties.message + ' ';
    })
  } else if(err.code === 11000){
      errors.username = "That username already exists. Please enter a different one."
  }
  return errors
}


module.exports.login_get = async (req, res) => {
    const {username, password} = req.body;
    //find document by username
     try {
       const user = await User.findOne({username});
    res.status(200).json(user);  
     } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
     }
}

module.exports.signup_post = async (req, res) => {
 const {username, password} = req.body;
     try {
 //  const user = await User.create({username, password});
 //---or with static signup method:
 const user = await User.signup(username, password);
 //--- create a webtoken:
 const token = createToken(user._id);
 res.status(200).json({username, token});
  } catch(err){
   //  const errors = handleErrors(err);
   //  res.status(400).json({errors});
   //---or with static signup method:
  res.status(400).json({err: err.message});
  }
}

module.exports.login_post = async (req, res) => {
    const {username, password} = req.body;
    try{
      //const user = await User.findOne({username, password});
      //---or with static login method:
      const user = await User.login(username, password);
      const token = createToken(user._id);
       res.status(200).json({username, token});
    } catch(err){
     //  const errors = handleErrors(err);
     //  res.status(400).json({errors});
      //---with static login method:
      res.status(400).json({err: err.message});
    }
}