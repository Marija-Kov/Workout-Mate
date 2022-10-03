const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

const getAllItems = async (req, res) => {
const workouts = await Workout.find({}).sort({createdAt: -1});
  res.status(200).json(workouts)
};

const getItem = async (req, res) => {
 const { id } = req.params;
 const workout = await Workout.findById(id);
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
  const { id } = req.params;
 if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(404).json({error: `You're trying to delete something that doesn't exist in the database. Please double-triple check the id of the item that you want to delete.`})
 };
const workout = await Workout.findOneAndUpdate({_id: id}, {
...req.body
});
  if(!workout){
     return res.status(404).json({error: 'no such thing, sorry!'})
 };
 res.status(200).json(workout);
};
// DELETE an item
const deleteItem = async (req, res) => {
 const { id } = req.params;
 if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(404).json({error: `You're trying to delete something that doesn't exist in the database. Please double-triple check the id of the item that you want to delete.`})
 };
 const workout = await Workout.findOneAndDelete({_id: id});

  if(!workout){
     return res.status(404).json({error: 'no such thing, sorry!'})
 };
 res.status(200).json(workout);
};

module.exports = {getAllItems,
       getItem,
       addItem,
       deleteItem,
       updateItem}