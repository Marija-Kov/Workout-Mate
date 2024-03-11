const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const { tryCatch } = require("../error/tryCatch");

router.post("/signup", tryCatch(authController.signup_post));
router.get("/:accountConfirmationToken", tryCatch(authController.verify_user));
router.post("/login", tryCatch(authController.login_post));
router.post("/logout", tryCatch(authController.logout));

router.use(requireAuth);

router.patch("/:id", tryCatch(authController.user_update_patch));
router.delete("/:id", tryCatch(authController.user_deletion));
router.get("/download/:id", tryCatch(authController.download_user_data));

module.exports = router;
