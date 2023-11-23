const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");
const { ApiError } = require("../error/error");

const getAllWorkouts = async (user, page, searchQuery) => {
  if (!user) {
    ApiError.notAuthorized("Not authorized");
  }
  const user_id = user._id;
  const limit = 3;
  const allUserWorkoutsMuscleGroups = (await Workout.find({ user_id })).map(
    (workout) => workout.muscle_group
  );
  const allUserWorkoutsByQuery = await Workout.find(
    searchQuery
      ? { user_id, title: new RegExp(`^${searchQuery.toLowerCase()}`) }
      : { user_id }
  );
  const total = allUserWorkoutsByQuery.length;
  const workoutsChunk = await Workout.find(
    searchQuery
      ? { user_id, title: new RegExp(`^${searchQuery.toLowerCase()}`) }
      : { user_id }
  )
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit);
  const pageSpread = pageSpreadHelper(allUserWorkoutsByQuery.length, limit);
  const noWorkoutsByQuery = total
    ? false
    : `No workouts found by query '${searchQuery}'`;
  return {
    total,
    allUserWorkoutsMuscleGroups,
    workoutsChunk,
    limit,
    pageSpread,
    noWorkoutsByQuery,
  };
};

const addWorkout = async (title, muscleGroup, reps, load, user) => {
  if (!user) {
    ApiError.notAuthorized("Not authorized");
  }
  if (!title || !muscleGroup || !String(reps) || !String(load)) {
    ApiError.badInput("Please fill out the empty fields");
  }
  if (title && !title.match(/^[a-zA-Z\s]*$/)) {
    ApiError.badInput("Title may contain only letters");
  }
  if (title && title.length > 30) {
    ApiError.badInput("Too long title - max 30 characters");
  }
  if (reps && reps > 9999) {
    ApiError.badInput("Reps value too large");
  }
  if (load && load > 9999) {
    ApiError.badInput("Load value too large");
  }
  const user_id = user._id;
  const allWorkoutsByUser = await Workout.find({ user_id });
  const limit =
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_WORKOUTS_PER_USER)
      : Number(process.env.TEST_MAX_WORKOUTS_PER_USER);
  if (allWorkoutsByUser.length === limit) {
    const _id = allWorkoutsByUser[0]._id;
    await Workout.findOneAndDelete({ _id });
  }
  const workout = await Workout.create({
    title: title.trim().toLowerCase(),
    muscle_group: muscleGroup,
    reps,
    load,
    user_id,
  });
  return workout;
};

const updateWorkout = async (id, body) => {
  const { title, reps, load } = body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ApiError.notFound("Invalid workout id");
  }
  if (title && !title.match(/^[a-zA-Z\s]*$/)) {
    ApiError.badInput("Title may contain only letters");
  }
  if (title && title.length > 30) {
    ApiError.badInput("Too long title - max 30 characters");
  }
  if (reps && reps > 9999) {
    ApiError.badInput("Reps value too large");
  }
  if (load && load > 9999) {
    ApiError.badInput("Load value too large");
  }
  const workout = await Workout.findOneAndUpdate({ _id: id }, body, {
    new: true,
    runValidators: true,
  });
  return workout;
};

const deleteWorkout = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ApiError.notFound("Invalid workout id");
  }
  const workout = await Workout.findOneAndDelete({ _id: id });
  if (!workout) {
    ApiError.notFound(`Workout id (${id}) does not exist`);
  }
  const workouts = await Workout.find({ user_id: workout.user_id });
  return { workout: workout, remaining: workouts.length };
};

const deleteAllWorkouts = async (user) => {
  if (!user) {
    ApiError.notAuthorized("Not authorized");
  }
  const user_id = user._id;
  const workouts = await Workout.deleteMany({ user_id });
  return workouts;
};

const pageSpreadHelper = (t, l) => {
  const pagesNum = Math.ceil(t / l);
  let spread = [];
  for (let i = 1; i <= pagesNum; ++i) {
    spread.push(i);
  }
  return spread;
};

module.exports = {
  getAllWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  deleteAllWorkouts,
};
