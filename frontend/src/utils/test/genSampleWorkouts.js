import uuid from "react-uuid";

export function genSampleWorkouts(searchFor = "", page = 1, itemsPerPage) {
  const workoutTitles = [
    "bench press",
    "pullups",
    "pushups",
    "burpees",
    "squats",
    "arm curls",
    "situps",
    "lunges"
  ];
  const workouts = [];
  for (let i = 0; i < workoutTitles.length; ++i) {
    workouts.push({
      _id: uuid(),
      title: workoutTitles[i],
      reps: Math.floor(Math.random() * 99) + 1,
      load: Math.floor(Math.random() * 50),
      user_id: "userid",
    });
  }
  let noWorkoutsByQuery = false;
  const searchResults = workouts.filter(e => {
    const regExp = `^${searchFor}`;
    return e.title.match(regExp);
  });
  if(!searchResults.length) {
    noWorkoutsByQuery = true;
    return { searchResults, resultsOnPage: [], noWorkoutsByQuery}
  } 
  const firstResultOnPage_Index = Math.floor(workouts.length/itemsPerPage) * (page - 1);
  const resultsOnPage = searchResults.slice(firstResultOnPage_Index, firstResultOnPage_Index + itemsPerPage + 1);
  return { searchResults, resultsOnPage, noWorkoutsByQuery }
}

