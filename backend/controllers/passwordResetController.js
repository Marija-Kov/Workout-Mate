const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sendEmail = require("../middleware/sendEmail");

module.exports.reset_password_request = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
   res.status(404).json({
        error: `That email address doesn't exist in our database`,
      });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpires = Date.now() + 3600000;
  await user.save();
  
  const clientUrl = "localhost:3000";
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

  sendEmail(
    user.email,
    "Password Reset Request",
    {
      link: resetLink,
    },
    "../templates/requestPasswordReset.handlebars"
  );

  return res.status(200).json({ success: `Reset link was sent to your inbox.` });
};

module.exports.reset_password = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const user = await User.findOne({
  resetPasswordToken: token,
  resetPasswordTokenExpires: { $gt: Date.now() }
});
if (!user) {
  throw Error("Invalid or expired password reset token" );
} 
if (!validator.isStrongPassword(password)) {
  throw Error("Password not strong enough");
}
if(password!==confirmPassword){
  throw Error("Passwords must match")
}else{
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