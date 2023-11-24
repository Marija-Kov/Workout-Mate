const {
  forgotPassword,
  resetPassword,
} = require("../businessLogic/passwordReset");

module.exports.reset_password_request = async (req, res) => {
  const { email } = req.body;
  const result = await forgotPassword(email);
  return res.status(200).json(result);
};

module.exports.reset_password = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const result = await resetPassword(token, password, confirmPassword);
  return res.status(200).json(result);
};
