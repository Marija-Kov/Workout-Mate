const {
  signup,
  verify_user,
  login,
  updateUser,
  deleteUser,
  downloadUserData,
} = require("../businessLogic/auth");

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  const { id, confirmationToken } = await signup(email, password);
  res.status(201).json({
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
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: tokenExpires,
    })
    .json({ id, email, username, profileImg });
};

module.exports.logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "logout", {
      maxAge: 0,
    })
    .json({ loggedOut: true });
};

module.exports.user_update_patch = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const token = req.headers.authorization.slice(7);
  const body = req.body;
  const { email, username, profileImg } = await updateUser(user, id, body);
  return res.status(200).json({
    user: {
      id,
      email,
      username,
      profileImg,
      token,
    },
    success: "Profile updated.",
  });
};

module.exports.user_deletion = async (req, res) => {
  const { id } = req.params;
  await deleteUser(id);
  res.status(200).json({ success: "Account deleted successfully" });
};

module.exports.download_user_data = async (req, res) => {
  const { id } = req.params;
  const { user, workouts } = await downloadUserData(id);
  res.status(200).json({ user, workouts });
};
