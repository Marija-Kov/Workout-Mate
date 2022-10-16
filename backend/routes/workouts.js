const express = require('express');
const router = express.Router();
const { getAllItems,
       getItem,
       addItem,
       deleteItem,
       updateItem } = require('../controllers/workoutController')


router.get('/', getAllItems);

router.get('/:id', getItem);

router.post('/', addItem);

router.delete('/:id', deleteItem);

router.patch('/:id', updateItem);


module.exports = router;