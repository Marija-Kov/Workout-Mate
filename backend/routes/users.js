const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require("../middleware/requireAuth");

router.post('/signup', authController.signup_post);
router.get('/:accountConfirmationToken', authController.verify_user);
router.post('/login', authController.login_post);

router.use(requireAuth); 

router.patch('/:id', authController.user_update_patch);
router.delete('/:id', authController.user_deletion);

module.exports = router;