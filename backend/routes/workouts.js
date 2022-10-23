const express = require('express');
const router = express.Router();
const { getAllItems,
       getItem,
       addItem,
       deleteItem,
       updateItem } = require('../controllers/workoutController');

const requireAuth = require('../middleware/requireAuth');


router.use(requireAuth); 
// ^ this has to fire before any workout methods to make sure
// that the workout methods can only be executed if there is an authorized user 
// i.e. a 'user' property inside the request object.
router.get('/', getAllItems);

router.get('/:id', getItem);

router.post('/', addItem);

router.delete('/:id', deleteItem);

router.patch('/:id', updateItem);


module.exports = router;