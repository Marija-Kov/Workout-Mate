const User = require("../models/userModel");

class UserRepository {
  async create(email, password) {
    return User.signup(email, password);
  }

  async login(email, password) {
    return User.login(email, password);
  }

  async findAll() {
    return User.find({});
  }

  async findByEmail(email) {
    return User.findOne({ email: email });
  }

  async findAccountConfirmationToken(token) {
    return User.findOne({ accountConfirmationToken: token });
  }

  async findPasswordResetToken(token) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });
  }

  async delete(id) {
    return User.findOneAndDelete({ _id: id });
  }

  async update(id, body) {
    return User.findOneAndUpdate({ _id: id }, body, {
      new: true,
      runValidators: true,
    });
  }

  async save(user) {
    return user.save();
  }
}

module.exports = new UserRepository();