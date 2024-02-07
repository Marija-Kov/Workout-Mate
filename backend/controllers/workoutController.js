const {
  getAllWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  deleteAllWorkouts,
} = require("../businessLogic/workout");

module.exports.get_all_user_workouts = async (req, res) => {
  const user = req.user;
  const page = req.query.p || 0;
  const searchQuery = req.query.search || null;
  const result = await getAllWorkouts(user, page, searchQuery);
  res.status(200).json(result);
};

module.exports.add_workout = async (req, res) => {
  const user = req.user;
  const { title, muscle_group, reps, load } = req.body;
  const workout = await addWorkout(title, muscle_group, reps, load, user);
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
  const user = req.user;
  const workouts = await deleteAllWorkouts(user);
  res.status(200).json(workouts);
};
