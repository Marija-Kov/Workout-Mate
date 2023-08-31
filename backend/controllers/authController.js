const User = require('../models/userModel');
const Workout = require("../models/workoutModel");
const jwt = require('jsonwebtoken');
const sendEmail = require("../middleware/sendEmail");

const expiresIn = Number(process.env.AUTH_TOKEN_EXPIRES_IN);
const createToken = (_id) => {
return jwt.sign({_id}, process.env.SECRET, {expiresIn: expiresIn})
}

module.exports.signup_post = async (req, res) => {
 const {email, password} = req.body;
     try {
 const user = await User.signup(email, password);
 const id = user._id;
 const confirmationToken = createToken(id);
 user.accountConfirmationToken = confirmationToken;
 user.accountConfirmationTokenExpires = Date.now() + 3600000;
 await user.save();

 const registeredUsers = await User.find({});
 const limit =
   process.env.NODE_ENV !== "test"
     ? Number(process.env.MAX_USERS)
     : Number(process.env.TEST_MAX_USERS);
 if (registeredUsers.length >= limit) {
   const id = registeredUsers[0]._id;
   await User.findOneAndDelete({ _id: id });
   await Workout.deleteMany({user_id: id});
 }

 const clientUrl = process.env.CLIENT_URL;
 const accountVerificationLink = `${clientUrl}/users?accountConfirmationToken=${confirmationToken}`;

   sendEmail(
     user.email,
     "Verify your account",
     {
       link: accountVerificationLink,
     },
     "../templates/verifySignup.handlebars"
   );

  res.status(200).json({id, token: confirmationToken, success: "Account created and pending confirmation. Please check your inbox."});
  } catch(err){
  res.status(400).json({error: err.message});
  }
}

module.exports.verify_user = async (req, res) => {
  const {accountConfirmationToken} = req.params;
  try {
   const user = await User.findOne({
    accountConfirmationToken: accountConfirmationToken,
  });
  if(!user){
    return res.status(404).json({error: "User not found."})
  }
  user.accountStatus = "active";
  user.accountConfirmationToken = undefined;
  user.accountConfirmationTokenExpires = undefined;
  await user.save()  
   res.status(200).json({id: user._id, success: "Success! You may log in with your account now."})
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    try{
      const user = await User.login(email, password);
      const id = user._id;
      const username = user.username;
      const profileImg = user.profileImg;
      const token = createToken(id);
      const tokenExpires = Date.now() + expiresIn*1000;
       res.status(200).json({id, email, token, username, profileImg, tokenExpires});
    } catch(err){
      res.status(400).json({error: err.message});
    }
}

module.exports.user_update_patch = async (req, res) => {
  const {id} = req.params;
  const token = req.headers.authorization.slice(7);
  try {
   const user = await User.findOneAndUpdate({_id:id}, req.body, {new: true, runValidators: true}); 
   res
     .status(200)
     .json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImg: user.profileImg,
        token: token,
      },
       success: "Profile updated.",
     });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong. Please refresh and try again.", logError: error.message });
  }
};

module.exports.user_deletion = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
   res.status(200).json({success: "Account deleted successfully"});
  } catch (error) {
    res.status(400).json({error: "Something went wrong. Please try later.", logError: error.message})
  }
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