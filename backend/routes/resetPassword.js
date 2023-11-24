const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");
const { tryCatch } = require("../error/tryCatch");

router.post("/", tryCatch(passwordResetController.forgot_password));
router.get("/:token", tryCatch(passwordResetController.reset_password));
router.patch("/:token", tryCatch(passwordResetController.reset_password));

module.exports = router;
