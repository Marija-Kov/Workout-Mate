const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
//token is in the value(string) of authorization property of req.headers
  const { authorization } = req.headers;
  if (!authorization){
      return res.status(401).json({error: 'Authorization token required'})
  }
  const token = authorization.split(' ')[1];
  try {
   const {_id} = jwt.verify(token, process.env.SECRET);
   // once the user is verified i.e. we extract the _id from the token:
   req.user = await User.findOne({_id }).select('_id'); // i.e: req.user._id = _id
   next(); 
  } catch (error){
    console.log(error);
    res.status(401).json({error: 'request not authorized'})
  }
}

module.exports = requireAuth;