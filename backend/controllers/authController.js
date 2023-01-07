const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

module.exports.signup_post = async (req, res) => {
 const {email, password} = req.body;
     try {
 const user = await User.signup(email, password);
 const id = user._id;
 const token = createToken(id);
 res.status(200).json({id, email, token});
  } catch(err){
  res.status(400).json({error: err.message});
  }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    try{
      const user = await User.login(email, password);
      const id = user._id;
      const profileImg = user.profileImg;
      const token = createToken(id);
       res.status(200).json({id, email, token, profileImg});
    } catch(err){
      res.status(400).json({error: err.message});
    }
}

module.exports.user_update_patch = async (req, res) => {
  const {id} = req.params;
  try {
   const user = await User.findOneAndUpdate({_id:id}, req.body, {new: true, runValidators: true}); 
   res.status(200).json({user: user, success: "Profile updated."});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.user_deletion = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    return res.status(404).json({ error: "Hmm, the user doesn't exist in the database." });
  }
  res.status(200).json(user);
};



////---- Error handling outside static method: ----////

// const handleErrors = (err) => {
//   let errors = { email: '', password:'' };

//   if(err.message.includes('User validation failed')){
//     Object.values(err.errors).forEach(e => {  // by extracting ({properties}) here...
//         let errorsProperty = e.properties.path; // you could simplify the next couple of lines
//         errors[errorsProperty] = e.properties.message + ' ';
//     })
//   } else if(err.code === 11000){
//       errors.email = "That email already exists. Please enter a different one."
//   }
//   return errors
// }

//....}catch(err){
//  res.status(400).json({errors});
//}