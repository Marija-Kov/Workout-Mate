const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.delete('/:id', authController.user_deletion);
router.post('/reset-password', authController.reset_password_request);


module.exports = router;