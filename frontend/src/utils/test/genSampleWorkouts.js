import store from "../../redux/store";

export function genSampleWorkouts(searchFor = "", page = 1, itemsPerPage = 3) {
  const dispatch = store.dispatch;
  const workoutTitles = [
    "bench press",
    "pullups",
    "pushups",
    "burpees",
    "squats",
    "arm curls",
    "situps",
    "lunges",
  ];
  const allUserWorkoutsMuscleGroups = [
    "chest",
    "forearmAndGrip",
    "chest",
    "ab",
    "glute",
    "biceps",
    "ab",
    "leg",
  ];
  const workouts = [];
  for (let i = 0; i < workoutTitles.length; ++i) {
    const workout = {
      _id: `w${i}`,
      title: workoutTitles[i],
      muscle_group: allUserWorkoutsMuscleGroups[i],
      reps: Math.floor(Math.random() * 99) + 1,
      load: Math.floor(Math.random() * 50),
      user_id: "userid",
      createdAt: "2023-04-10T13:01:15.208+00:00",
      updatedAt: "2023-04-10T13:01:15.208+00:00",
    };
    workouts.unshift(workout);
    dispatch({ type: "CREATE_WORKOUT", payload: workout });
  }
  let noWorkoutsByQuery = false;
  const searchResults = workouts.filter((e) => {
    const regExp = `^${searchFor}`;
    return e.title.match(regExp);
  });
  if (!searchResults.length) {
    noWorkoutsByQuery = true;
    return {
      total: 0,
      searchResults,
      limit: itemsPerPage,
      allUserWorkoutsMuscleGroups,
      workoutsChunk: [],
      noWorkoutsByQuery,
    };
  }
  const firstResultOnPage_Index =
    Math.floor(workouts.length / itemsPerPage) * (page - 1);
  const workoutsChunk = searchResults.slice(
    firstResultOnPage_Index,
    firstResultOnPage_Index + itemsPerPage
  );
  return {
    total: searchResults.length,
    searchResults,
    limit: itemsPerPage,
    allUserWorkoutsMuscleGroups,
    workoutsChunk,
    noWorkoutsByQuery,
  };
}
