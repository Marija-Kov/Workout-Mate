const {
  getAllWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  deleteAllWorkouts,
} = require("../businessLogic/workout");
const jwt = require("jsonwebtoken");

module.exports.get_all_user_workouts = async (req, res) => {
  const token = req.cookies.token;
  const { _id } = jwt.verify(token, process.env.SECRET);
  const page = req.query.p || 1;
  const searchQuery = req.query.search || null;
  const result = await getAllWorkouts(_id, page, searchQuery);
  res.status(200).json(result);
};

module.exports.add_workout = async (req, res) => {
  const token = req.cookies.token;
  const { _id } = jwt.verify(token, process.env.SECRET);
  const { title, muscle_group, reps, load } = req.body;
  const workout = await addWorkout(title, muscle_group, reps, load, _id);
  res.status(201).json(workout);
};

module.exports.update_workout = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const workout = await updateWorkout(id, body);
  res.status(200).json(workout);
};

module.exports.delete_workout = async (req, res) => {
  const { id } = req.params;
  const result = await deleteWorkout(id);
  res.status(200).json(result);
};

module.exports.delete_all_user_workouts = async (req, res) => {
  const token = req.cookies.token;
  const { _id } = jwt.verify(token, process.env.SECRET);
  const workouts = await deleteAllWorkouts(_id);
  res.status(200).json(workouts);
};
