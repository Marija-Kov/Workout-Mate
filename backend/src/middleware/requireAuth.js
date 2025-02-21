const jwt = require("jsonwebtoken");
const User = require("../dataAccessLayer/userRepository");

/**
 * Runs before all protected routes.
 */
const requireAuth = async (req, res, next) => {
  let token;
  try {
    token = req.cookies.token;
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(_id);
    next();
  } catch {
    return res.status(401).cookie("token", "logout", { maxAge: 0 }).json({
      error: "Not authorized",
    });
  }
};

module.exports = requireAuth;
