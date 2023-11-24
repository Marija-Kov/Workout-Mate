const {
  signup,
  verify_user,
  login,
  updateUser,
  deleteUser,
} = require("../businessLogic/auth");

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  const { id, confirmationToken } = await signup(email, password);
  res.status(200).json({
    id,
    token: confirmationToken,
    success:
      "Account created and pending confirmation. Please check your inbox.",
  });
};

module.exports.verify_user = async (req, res) => {
  const { accountConfirmationToken } = req.params;
  const { user } = await verify_user(accountConfirmationToken);
  res.status(200).json({
    id: user._id,
    success: "Success! You may log in with your account now.",
  });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  const { id, token, username, profileImg, tokenExpires } = await login(
    email,
    password
  );
  res
    .status(200)
    .json({ id, email, token, username, profileImg, tokenExpires });
};

module.exports.user_update_patch = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const token = req.headers.authorization.slice(7);
  const body = req.body;
  const { userUpdated } = await updateUser(user, id, body);
  res.status(200).json({
    user: {
      id: userUpdated._id,
      email: userUpdated.email,
      username: userUpdated.username,
      profileImg: userUpdated.profileImg,
      token: token,
    },
    success: "Profile updated.",
  });
};

module.exports.user_deletion = async (req, res) => {
  const { id } = req.params;
  await deleteUser(id);
  res.status(200).json({ success: "Account deleted successfully" });
};
