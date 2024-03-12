const Workout = require("../dataAccessLayer/workoutRepository");
const { ApiError } = require("../error/error");

const getAllWorkouts = async (user_id, page, searchQuery) => {
  const limit = 3;
  const allUserWorkoutsMuscleGroups = (await Workout.getAll(user_id)).map(
    (workout) => workout.muscle_group
  );
  const allUserWorkoutsByQuery = await Workout.getByQuery(user_id, searchQuery);
  const total = allUserWorkoutsByQuery.length;
  const workoutsChunk = await Workout.getChunkByQuery(
    user_id,
    searchQuery,
    page,
    limit
  );
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

const addWorkout = async (title, muscleGroup, reps, load, user_id) => {
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
  const allWorkoutsByUser = await Workout.getAll(user_id);
  const limit =
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_WORKOUTS_PER_USER)
      : Number(process.env.TEST_MAX_WORKOUTS_PER_USER);
  if (allWorkoutsByUser.length === limit) {
    const id = allWorkoutsByUser[0]._id;
    await Workout.delete(id);
  }
  const workout = await Workout.add(title.trim().toLowerCase(), muscleGroup, reps, load, user_id);
  return workout;
};

const updateWorkout = async (id, body) => {
  const { title, muscle_group, reps, load } = body;
  if (!Workout.isValidId(id)) {
    ApiError.notFound("Invalid workout id");
  }
  if (title && !title.match(/^[a-zA-Z\s]*$/)) {
    ApiError.badInput("Title may contain only letters");
  }
  if (
    muscle_group &&
    ![
      "chest",
      "shoulder",
      "biceps",
      "triceps",
      "leg",
      "back",
      "glute",
      "ab",
      "calf",
      "forearm and grip",
    ].includes(muscle_group)
  ) {
    ApiError.badInput("Invalid muscle group value");
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
  const workout = await Workout.update(id, body);
  return workout;
};

const deleteWorkout = async (id) => {
  if (!Workout.isValidId(id)) {
    ApiError.notFound("Invalid workout id");
  }
  const workout = await Workout.delete(id);
  if (!workout) {
    ApiError.notFound(`Workout id (${id}) does not exist`);
  }
  const workouts = await Workout.getAll(workout.user_id);
  return { workout: workout, remaining: workouts.length };
};

const deleteAllWorkouts = async (user_id) => {
  const workouts = await Workout.deleteAll(user_id);
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
