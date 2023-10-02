const express = require('express');
const router = express.Router();
const {
  getAllItems,
  addItem,
  deleteItem,
  updateItem,
  deleteAllUserItems
} = require("../controllers/workoutController");
const { tryCatch } = require("../error/tryCatch");
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth); 

router.get('/', tryCatch(getAllItems));
router.post('/', tryCatch(addItem));
router.delete('/:id', tryCatch(deleteItem));
router.delete('/', tryCatch(deleteAllUserItems));
router.patch('/:id', tryCatch(updateItem));


module.exports = router;