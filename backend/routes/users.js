const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.patch('/:id', authController.user_update_patch);
router.delete('/:id', authController.user_deletion);

module.exports = router;