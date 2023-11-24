const UserRepository = require("../dataAccessLayer/userRepository");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");

const User = new UserRepository();

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
  if (user.accountConfirmationToken) {
    ApiError.notAuthorized(
      "The account with that email address has not yet been confirmed"
    );
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  const expiresIn =
    process.env.NODE_ENV !== "test"
      ? Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN)
      : Number(process.env.TEST_RESET_PASSWORD_TOKEN_EXPIRES_IN);
  user.resetPasswordTokenExpires = Date.now() + expiresIn;
  await User.save(user);
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
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await User.save(user);
    return { success: `Password reset successfully` };
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
