const User = require("../dataAccessLayer/userRepository");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");

const forgotPassword = async (email) => {
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    ApiError.badInput("Please enter your email address");
  }
  const user = await User.findByEmail(email);
  if (!user) {
    ApiError.notFound("That email does not exist in our database");
  }
  if (user.account_status === "pending") {
    ApiError.notAuthorized("The account with that email address has not yet been confirmed");
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const { _id } = user;
    process.env.NODE_ENV !== "test"
      ? Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN)
      : Number(process.env.TEST_RESET_PASSWORD_TOKEN_EXPIRES_IN);
  await User.savePasswordResetToken(_id, resetToken);
  const clientUrl = process.env.CLIENT_URL;
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
  sendEmail(
    email,
    "Password Reset Request",
    {
      link: resetLink,
    },
    "../templates/requestPasswordReset.handlebars"
  );

  return {
    resetToken: resetToken,
    success: `Reset link was sent to your inbox.`,
  };
};

const resetPassword = async (token, password, confirmPassword) => {
  const user = await User.findPasswordResetToken(token);
  if (!user) {
    ApiError.badInput("Invalid token");
  }
  if (!validator.isStrongPassword(password)) {
    ApiError.badInput("Password not strong enough");
  }
  if (password !== confirmPassword) {
    ApiError.badInput("Passwords must match");
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.changePassword(hash, user._id);
    return { success: `Password reset successfully` };
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
