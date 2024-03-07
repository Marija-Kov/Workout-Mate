import * as a from "./workoutActionTypes";

const init = {
  total: 0,
  limit: 3,
  allUserWorkoutsMuscleGroups: [],
  workoutsChunk: [],
  pageSpread: [1],
};

export const workoutReducer = (state = init, action) => {
  switch (action.type) {
    case a.SET_WORKOUTS:
      return action.payload;
    case a.CREATE_WORKOUT:
      ++state.total;
      return {
        ...state,
        workoutsChunk: [action.payload, ...state.workoutsChunk],
        allUserWorkoutsMuscleGroups: [
          action.payload.muscle_group,
          ...state.allUserWorkoutsMuscleGroups,
        ],
        pageSpread: pageSpreadHelper(state.total, state.limit),
      };
    case a.UPDATE_WORKOUT:
      if (action.payload.muscle_group) {
        const prevMuscleGroupIndex = state.allUserWorkoutsMuscleGroups.indexOf(
          state.workoutsChunk.filter((e) => e._id === action.payload._id)[0]
            .muscle_group
        );
        state.allUserWorkoutsMuscleGroups.splice(prevMuscleGroupIndex, 1);
      }
      state.workoutsChunk = state.workoutsChunk.filter(
        (e) => e._id !== action.payload._id
      );
      const updateMuscleGroups = action.payload.muscle_group
        ? [...state.allUserWorkoutsMuscleGroups, action.payload.muscle_group]
        : state.allUserWorkoutsMuscleGroups;
      return {
        ...state,
        allUserWorkoutsMuscleGroups: updateMuscleGroups,
        workoutsChunk: [action.payload, ...state.workoutsChunk],
      };
    case a.DELETE_WORKOUT:
      --state.total;
      const newWorkoutsChunk = state.workoutsChunk.filter(
        (e) => e._id !== action.payload._id
      );
      const prevMuscleGroupIndex = state.allUserWorkoutsMuscleGroups.indexOf(
        state.workoutsChunk.filter((e) => e._id === action.payload._id)[0]
          .muscle_group
      );
      state.allUserWorkoutsMuscleGroups.splice(prevMuscleGroupIndex, 1);
      return {
        ...state,
        workoutsChunk: newWorkoutsChunk,
        pageSpread: pageSpreadHelper(state.total, state.limit),
      };
    case a.RESET_WORKOUTS_STATE:
      return init;
    default:
      return state;
  }
};

const pageSpreadHelper = (t, l) => {
  const pagesNum = Math.ceil(t / l);
  let spread = [];
  for (let i = 1; i <= pagesNum; ++i) {
    spread.push(i);
  }
  return spread;
};
