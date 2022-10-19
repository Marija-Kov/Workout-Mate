const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup_post);

router.get('/', authController.login_get);


router.post('/login', authController.login_post);




module.exports = router;