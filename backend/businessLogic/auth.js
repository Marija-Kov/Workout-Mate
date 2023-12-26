const User = require("../dataAccessLayer/userRepository");
const Workout = require("../dataAccessLayer/workoutRepository");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");

const expiresIn = Number(process.env.AUTH_TOKEN_EXPIRES_IN);
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
};

const signup = async (email, password) => {
  const user = await User.create(email, password);
  const id = user._id;
  const confirmationToken = createToken(id);
  user.accountConfirmationToken = confirmationToken;
  user.accountConfirmationTokenExpires = Date.now() + 3600000;
  await User.save(user);
  const registeredUsers = await User.findAll();
  const limit =
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_USERS)
      : Number(process.env.TEST_MAX_USERS);
  if (registeredUsers.length === limit) {
    const id = registeredUsers[0]._id;
    await User.delete(id);
    await Workout.deleteAll(id);
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
  const user = await User.findAccountConfirmationToken(token);
  if (!user) {
    ApiError.notFound(
      "Couldn't find user with provided confirmation token - this might be because the account has already been confirmed"
    );
  }
  user.accountStatus = "active";
  user.accountConfirmationToken = undefined;
  user.accountConfirmationTokenExpires = undefined;
  await User.save(user);
  return { user };
};

const login = async (email, password) => {
  const { _id, username, profileImg } = await User.login(email, password);
  const token = createToken(_id);
  const tokenExpires = Date.now() + expiresIn * 1000;
  return { id: _id, token, username, profileImg, tokenExpires };
};

const updateUser = async (user, id, body) => {
  if (!user) {
    ApiError.notAuthorized("Not authorized");
  }
  if (!body.username || (body.username && !body.username.trim())) return;
  if (
    body.username &&
    body.username.trim() &&
    body.username.trim().length > 12
  ) {
    ApiError.badInput("Too long name");
  }
  if (
    body.username &&
    body.username.trim() &&
    !body.username.match(/^[a-zA-Z0-9._]+$/)
  ) {
    ApiError.badInput(
      "Username may only contain letters, numbers, dots and underscores"
    );
  }
  if (
    body.profileImg &&
    !body.profileImg.match(/^data:image\/jpeg/) &&
    !body.profileImg.match(/^data:image\/png/) &&
    !body.profileImg.match(/^data:image\/svg/)
  ) {
    ApiError.badInput("Bad input, must be JPEG, PNG or SVG image format");
  }
  if (body.profileImg && Buffer.byteLength(body.profileImg) > 1048576) {
    ApiError.badInput("Image too big - 1MB max");
  }
  const userUpdated = await User.update(id, body);
  if (userUpdated) return userUpdated;
  return;
};

const deleteUser = async (id) => {
  if (!id) {
    ApiError.notAuthorized("Not authorized");
  }
  await User.delete(id);
};

const downloadUserData = async (id) => {
  const user = await User.findById(id);
  const workouts = await Workout.getAll(id);
  return { user, workouts };
};

module.exports = {
  signup,
  verify_user,
  login,
  updateUser,
  deleteUser,
  downloadUserData,
};
