const express = require('express');
const router = express.Router();
const { getAllItems,
       getItem,
       addItem,
       deleteItem,
       updateItem } = require('../controllers/workoutController')
const authController = require('../controllers/authController')

router.get('/api/workouts', getAllItems);

router.get('/api/workouts/:id', getItem);

router.post('/api/workouts/', addItem);

router.delete('/api/workouts/:id', deleteItem);

router.patch('/api/workouts/:id', updateItem);

// AUTH ROUTES 

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;