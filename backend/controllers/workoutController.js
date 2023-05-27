const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

const getAllItems = async (req, res) => {
 const page = req.query.p || 0;
 const itemsPerPage = 3;
 const search = req.query.search || null;
 const user_id = req.user._id; 

 try {
   const allUserWorkoutsByQuery = await Workout.find(
     search
       ? { user_id, title: new RegExp(`^${search.toLowerCase()}`) }
       : { user_id }
   );
   const workoutsChunk = await Workout.find(
     search ? { user_id, title: new RegExp(`^${search.toLowerCase()}`)} : { user_id }
   ) 
     .sort({ createdAt: -1 })
     .skip(page * itemsPerPage)
     .limit(itemsPerPage);
   res
     .status(200)
     .json({
       allUserWorkoutsByQuery: allUserWorkoutsByQuery,
       workoutsChunk: workoutsChunk,
       limit: itemsPerPage,
       noWorkoutsByQuery: allUserWorkoutsByQuery.length ? false : `No workouts found by query '${search}'`,
     });
 } catch (error) {
   res.status(400).json({ error: error.message });
 }
};

const addItem = async (req, res) => {
    const {title, reps, load} = req.body;
    const user_id = req.user._id;
    const allWorkoutsByUser = await Workout.find({ user_id });
    const limit = process.env.NODE_ENV === "test" ? 6 : process.env.MAX_WORKOUTS_PER_USER;
    if (allWorkoutsByUser.length >= limit) {
      const id = allWorkoutsByUser[0]._id;
      await Workout.findOneAndDelete({ _id: id });
    }
  try {
   const workout = await Workout.create({title: title.trim().toLowerCase(), reps, load, user_id});
   res.status(200).json(workout);
  } catch(error){
   res.status(400).json({error: error.message})
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
 if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(404).json({error: `Invalid workout id.`})
 };
try {
const workout = await Workout.findOneAndUpdate({_id: id}, req.body, {new: true, runValidators: true}); 
res.status(200).json(workout);
} catch (error) {
  res.status(400).json({error: error.message})
 }
};

const deleteItem = async (req, res) => {
 const { id } = req.params;
 if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(404).json({error: `Invalid workout id`})
 };
 try{
  const workout = await Workout.findOneAndDelete({_id: id});
  if(!workout){
     return res.status(404).json({error: `Workout id (${id}) does not exist`})
  };
 const workouts = await Workout.find({user_id: workout.user_id});
 res.status(200).json({workout: workout, remaining: workouts.length});
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
};

const deleteAllUserItems = async (req, res) => {
  const user_id = req.user._id;
  try {
   const workouts = await Workout.deleteMany({ user_id }); 
   res.status(200).json(workouts);
  } catch (error){
   res.status(400).json({ error: error.message });
  }
};

module.exports = {
       getAllItems,
       addItem,
       deleteItem,
       updateItem,
       deleteAllUserItems
      }


////------ Handling missing input server-side -----////

    // let emptyFields = [];
    // if(!title){
    //   emptyFields.push('title')
    // };
    // if(!reps){
    //   emptyFields.push('reps')
    // };
    // if(!load){
    //   emptyFields.push('load')
    // };
    // if(emptyFields.length > 0){
    //   res.status(400).json({error: 'Please fill in all the fields.', emptyFields})
    // };