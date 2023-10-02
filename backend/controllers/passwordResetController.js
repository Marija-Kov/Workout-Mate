const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");

module.exports.reset_password_request = async (req, res) => {
  const { email } = req.body;
  if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
   ApiError.badInput("Please enter your email address")
  }
  const user = await User.findOne({ email });
  if(!user){
   ApiError.notFound("That email does not exist in our database")
  }
  if(user.accountConfirmationToken){
   ApiError.notAuthorized("The account with that email address has not yet been confirmed")
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  const expiresIn =
   process.env.NODE_ENV !== "test"
     ? Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN)
     : Number(process.env.TEST_RESET_PASSWORD_TOKEN_EXPIRES_IN);
  user.resetPasswordTokenExpires = Date.now() + expiresIn;
  await user.save();
  const clientUrl = process.env.CLIENT_URL;
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
  sendEmail(
    user.email,
    "Password Reset Request",
    {
      link: resetLink,
    },
    "../templates/requestPasswordReset.handlebars"
  );
  return res.status(200).json({ resetToken: resetToken, success: `Reset link was sent to your inbox.` });
};

module.exports.reset_password = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const user = await User.findOne({
  resetPasswordToken: token,
  resetPasswordTokenExpires: { $gt: Date.now() }
});
if(!user){
  ApiError.badInput("Invalid token") 
} 
if(!validator.isStrongPassword(password)){
  ApiError.badInput("Password not strong enough")
}
if(password!==confirmPassword){
  ApiError.badInput("Passwords must match")
} else {
 const salt = await bcrypt.genSalt(10);
 const hash = await bcrypt.hash(password, salt);
 user.password = hash;
 user.resetPasswordToken = undefined;
 user.resetPasswordTokenExpires = undefined;
 await user.save();
  
  return res.status(200).json({
      success: `Password reset successfully`
    });  
  }
  

};