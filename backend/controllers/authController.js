const User = require('../models/userModel');
const Token = require('../models/resetPasswordTokenModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const sendEmail = require("../middleware/sendEmail");

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

module.exports.signup_post = async (req, res) => {
 const {email, password} = req.body;
     try {
 //  const user = await User.create({email, password});
 //---or with static signup method:
 const user = await User.signup(email, password);
 //--- create a webtoken:
 const id = user._id;
 const token = createToken(id);
 res.status(200).json({id, email, token});
  } catch(err){
   //  const errors = handleErrors(err);
   //  res.status(400).json({errors});
   //---or with static signup method:
   console.log(`Error at authController.js-->signup_post : ${err.message}`)
  res.status(400).json({error: err.message});
  }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    try{
      //const user = await User.findOne({email, password});
      //---or with static login method:
      const user = await User.login(email, password);
      const id = user._id;
      const token = createToken(id);
       res.status(200).json({id, email, token});
    } catch(err){
     //  const errors = handleErrors(err);
     //  res.status(400).json({errors});
      //---with static login method:
      res.status(400).json({error: err.message});
    }
}

module.exports.user_deletion = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    return res.status(404).json({ error: "Hmm, the user doesn't exist in the database." });
  }
  res.status(200).json(user);
};

module.exports.reset_password_request = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email});
  if(!user) {
    console.log('Error at authController, reset_password_request : The email does not exist in our database')
    return res.status(404).json({error: `The user with the provided email address doesn't exist in our database`})
  }

  let oldToken = await Token.findOne({ userId: user._id });
  if (oldToken) await oldToken.deleteOne();
  
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(process.env.SALT));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now()
  }).save();
  const clientUrl = process.env.EMAIL_HOST;
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}&id=${user._id}`;
  
  sendEmail(
    user.email,
    "Password Reset Request",
    {
      link: resetLink,
    },
    "../templates/requestPasswordReset.handlebars"
  );
  
  return res.status(200).json({resetLink: resetLink})
};