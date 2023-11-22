const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");

const expiresIn = Number(process.env.AUTH_TOKEN_EXPIRES_IN);
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
};

const signup = async (email, password) => {
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
  return { id, confirmationToken };
};

const verify_user = async (token) => {
  if (!token) {
    ApiError.notFound("Account confirmation token not found");
  }
  const user = await User.findOne({
    accountConfirmationToken: token,
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
  return { user };
};

const login = async (email, password) => {
  const user = await User.login(email, password);
  const id = user._id;
  const username = user.username;
  const profileImg = user.profileImg;
  const token = createToken(id);
  const tokenExpires = Date.now() + expiresIn * 1000;
  return { id, token, username, profileImg, tokenExpires };
};

const updateUser = async (user, id, body) => {
  if (!user) {
    ApiError.notAuthorized("Not authorized");
  }
  if (body.username && body.username.length > 12) {
    ApiError.badInput("Too long name");
  }
  if (
    body.profileImg &&
    !body.profileImg.match(/^data:image\/jpeg/) &&
    !body.profileImg.match(/^data:image\/png/) &&
    !body.profileImg.match(/^data:image\/svg/)
  ) {
    ApiError.badInput("Bad input, must be JPEG, PNG or SVG image format");
  }
  const userUpdated = await User.findOneAndUpdate({ _id: id }, body, {
    new: true,
    runValidators: true,
  });
  return { userUpdated };
};

const deleteUser = async (id) => {
  if (!id) {
    ApiError.notAuthorized("Not authorized");
  }
  await User.findOneAndDelete({ _id: id });
};

module.exports = {
  signup,
  verify_user,
  login,
  updateUser,
  deleteUser,
};
