const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

const getAllItems = async (req, res) => {
const workouts = await Workout.find({}).sort({createdAt: -1});
  res.status(200).json(workouts)
};

const getItem = async (req, res) => {
 const { id } = req.params;
 const workout = Workout.findById(id);
 if(!workout){
     return res.status(404).json({error: 'no such thing, sorry!'})
 }
 if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(404).json({error: 'No such workout'})
 }
 res.status(200).json(workout);
};

const addItem = async (req, res) => {
    const {title, reps, load} = req.body;
  try {
   const workouts = await Workout.create({title, reps, load});
   res.status(200).json(workouts);
  } catch(error){
   res.status(400).json({error: error.message})
  }
};
// UPDATE an item
const updateItem = async (req, res) => {

};
// DELETE an item
const deleteItem = async (req, res) => {

};

module.exports = {getAllItems,
       getItem,
       addItem,
       deleteItem,
       updateItem}