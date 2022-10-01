const express = require('express');

const router = express.Router();

router.get('/', (req, res)=> {
    res.json({mssg: 'GET all things'})
});

router.get('/:id', (req, res)=> {
    res.json({mssg: 'GET one thing'})
});

router.post('/', (req, res)=> {
    res.json({mssg: 'POST a thing'})
});

router.delete('/:id', (req, res)=> {
    res.json({mssg: 'DELETE a thing'})
});

router.patch('/:id', (req, res)=> {
    res.json({mssg: 'UPDATE a thing'})
});

module.exports = router;