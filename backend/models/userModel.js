const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const { ApiError } = require("../error/error");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: [8, "Your password must be at least 8 characters long."],
  },
  username: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  accountStatus: {
    type: String,
    enum: ["pending", "active"],
    default: "pending",
  },
  accountConfirmationToken: String,
  accountConfirmationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
});

userSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    ApiError.badInput("All fields must be filled");
  }
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    ApiError.badInput("Please enter valid email address");
  }
  if (!validator.isStrongPassword(password)) {
    ApiError.badInput("Password not strong enough");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    ApiError.badInput("Email already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash });
  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    ApiError.badInput("All fields must be filled");
  }
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    ApiError.badInput("Please enter valid email address");
  }
  const user = await this.findOne({ email });
  if (!user) {
    ApiError.badInput("That email does not exist in our database");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    ApiError.badInput("Wrong password");
  }
  if (user.accountStatus === "pending") {
    ApiError.badInput("You must verify your email before you log in");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
