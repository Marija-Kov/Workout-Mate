const express = require('express');
const router = express.Router();
const { getAllItems,
       getItem,
       addItem,
       deleteItem,
       updateItem } = require('../controllers/workoutController')
const authController = require('../controllers/authController')

router.get('/', getAllItems);

router.get('/:id', getItem);

router.post('/', addItem);

router.delete('/:id', deleteItem);

router.patch('/:id', updateItem);

// AUTH ROUTES 

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;