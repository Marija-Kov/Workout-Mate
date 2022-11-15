const express = require('express');
const router = express.Router();
const {
  getAllItems,
  addItem,
  deleteItem,
  updateItem,
  deleteAllUserItems
} = require("../controllers/workoutController");

const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth); 

router.get('/', getAllItems);

router.post('/', addItem);

router.delete('/:id', deleteItem);

router.delete('/', deleteAllUserItems);

router.patch('/:id', updateItem);


module.exports = router;