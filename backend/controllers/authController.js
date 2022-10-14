const User = require('../models/userModel');
const mongoose = require('mongoose');

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
  } catch(error){
   res.status(400).json({error: error.message})
  }

}

module.exports.login_post = (req, res) => {
    res.send('user login')
}