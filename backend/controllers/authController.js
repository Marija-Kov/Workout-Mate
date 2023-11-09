const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");

const expiresIn = Number(process.env.AUTH_TOKEN_EXPIRES_IN);
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
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
  if (registeredUsers.length === limit) {
    const id = registeredUsers[0]._id;
    await User.findOneAndDelete({ _id: id });
    await Workout.deleteMany({ user_id: id });
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
  res
    .status(200)
    .json({
      id,
      token: confirmationToken,
      success:
        "Account created and pending confirmation. Please check your inbox.",
    });
};

module.exports.verify_user = async (req, res) => {
  const { accountConfirmationToken } = req.params;
  if (!accountConfirmationToken) {
    ApiError.notFound("Account confirmation token not found");
  }
  const user = await User.findOne({
    accountConfirmationToken: accountConfirmationToken,
  });
  if (!user) {
    ApiError.notFound(
      "Couldn't find user with provided confirmation token - this might be because the account has already been confirmed"
    );
  }
  user.accountStatus = "active";
  user.accountConfirmationToken = undefined;
  user.accountConfirmationTokenExpires = undefined;
  await user.save();
  res
    .status(200)
    .json({
      id: user._id,
      success: "Success! You may log in with your account now.",
    });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.login(email, password);
  const id = user._id;
  const username = user.username;
  const profileImg = user.profileImg;
  const token = createToken(id);
  const tokenExpires = Date.now() + expiresIn * 1000;
  res
    .status(200)
    .json({ id, email, token, username, profileImg, tokenExpires });
};

module.exports.user_update_patch = async (req, res) => {
  if (!req.user) {
    ApiError.notAuthorized("Not authorized");
  }
  if (req.body.username && req.body.username.length > 12) {
    ApiError.badInput("Too long name");
  }
  if (
    req.body.profileImg &&
    !req.body.profileImg.match(/^data:image\/jpeg/) &&
    !req.body.profileImg.match(/^data:image\/png/) &&
    !req.body.profileImg.match(/^data:image\/svg/)
  ) {
    ApiError.badInput("Bad input, must be JPEG, PNG or SVG image format");
  }
  const { id } = req.params;
  const token = req.headers.authorization.slice(7);
  const user = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImg: user.profileImg,
      token: token,
    },
    success: "Profile updated.",
  });
};

module.exports.user_deletion = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    ApiError.notAuthorized("Not authorized");
  }
  await User.findOneAndDelete({ _id: id });
  res.status(200).json({ success: "Account deleted successfully" });
};
