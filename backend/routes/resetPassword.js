const express = require("express");
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

router.post("/", passwordResetController.reset_password_request);
router.get("/:token", passwordResetController.reset_password);
router.patch("/:token", passwordResetController.reset_password);

module.exports = router;
