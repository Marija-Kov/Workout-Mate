const User = require("../dataAccessLayer/userRepository");
const Workout = require("../dataAccessLayer/workoutRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sendEmail = require("../middleware/sendEmail");
const { ApiError } = require("../error/error");
const clientUrl = process.env.CLIENT_URL || "localhost:5173";

const signup = async (email, password) => {
  if (!email || !password) {
    ApiError.badInput("All fields must be filled");
  }
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    ApiError.badInput("Invalid email address");
  }
  if (!validator.isStrongPassword(password)) {
    ApiError.badInput(
      "Password not strong enough. Must contain upper and lowercase letters, numbers and symbols."
    );
  }
  let id = null;
  let confirmationToken = null;
  let user = await User.findByEmail(email);

  if (user) {
    if (user.account_status === "pending") {
      id = user._id;
      confirmationToken = jwt.sign({ id }, process.env.SECRET);
      await User.deleteConfirmationToken(id);
      await User.saveConfirmationToken(id, confirmationToken);
      const accountVerificationLink = `${clientUrl}/confirmaccount/?accountConfirmationToken=${confirmationToken}`;

      if (process.env.NODE_ENV !== "test") {
        sendEmail(
          user.email,
          "Verify your account",
          {
            link: accountVerificationLink,
          },
          "../templates/verifySignup.handlebars"
        );
      }
    } else if (user.account_status === "active") {
      id = user._id;
      confirmationToken = "dummyToken";
      if (process.env.NODE_ENV !== "test") {
        sendEmail(
          user.email,
          "Your WorkoutMate account",
          {
            link: `${clientUrl}/login`,
          },
          "../templates/accountAlreadyExists.handlebars"
        );
      }
    }
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = await User.create(email, hash);
    id = user._id;
    confirmationToken = jwt.sign({ id }, process.env.SECRET);
    await User.saveConfirmationToken(id, confirmationToken);
    const registeredUsers = await User.findAll();
    const limit = Number(process.env.MAX_USERS) || 10;
    /*
     The following block will trigger the deletion of the oldest registered user
     if the set limit is exceeded. This is done to avoid having to manually clear
     the database as the intention behind the app isn't to retain users at this time.
    */
    if (registeredUsers.length >= limit) {
      const id = registeredUsers[0]._id;
      await User.delete(id);
      await Workout.deleteAll(id);
    }
    const accountVerificationLink = `${clientUrl}/confirmaccount/?accountConfirmationToken=${confirmationToken}`;
    if (process.env.NODE_ENV !== "test") {
      sendEmail(
        user.email,
        "Verify your account",
        {
          link: accountVerificationLink,
        },
        "../templates/verifySignup.handlebars"
      );
    }
  }

  return { id, confirmationToken };
};

const verify_user = async (token) => {
  if (!token) {
    ApiError.notFound("Invalid token");
  }
  const user = await User.findConfirmationToken(token);
  if (!user) {
    ApiError.notFound("Invalid token");
  }
  await User.activate(user._id);
  return { user };
};

const login = async (email, password) => {
  if (!email || !password) {
    ApiError.badInput("All fields must be filled");
  }
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    ApiError.badInput("Invalid email address");
  }
  const user = await User.findByEmail(email);
  if (
    !user ||
    user.account_status === "pending" ||
    !(await bcrypt.compare(password, user.password))
  ) {
    ApiError.badInput("Invalid credentials");
  }
  const { _id, username, profileImg } = user;
  const token = jwt.sign({ _id }, process.env.SECRET);
  const tokenExpires = Number(process.env.AUTH_TOKEN_EXPIRES_IN_MS) || 86400000;
  return { token, username, profileImg, tokenExpires };
};

const updateUser = async (id, body) => {
  if ((!body.username || !body.username.trim()) && !body.profileImg) {
    return await User.findById(id);
  }
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
    ApiError.badMediaType("Bad media type, must be JPEG, PNG or SVG");
  }
  if (body.profileImg && Buffer.byteLength(body.profileImg) > 1048576) {
    ApiError.payloadTooLarge("Image too big - 1MB max");
  }
  const userUpdated = await User.update(id, body);
  return userUpdated;
};

const deleteUser = async (id) => {
  await User.delete(id);
};

const downloadUserData = async (id) => {
  const user = await User.findById(id);
  const workouts = await Workout.get(id);
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
