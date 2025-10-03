import * as a from "./workoutActionTypes";

const init = {
  total: 0, // total number of workouts that match a search query
  limit: 3,
  allUserWorkoutsMuscleGroups: [],
  workoutsChunk: [],
  pageSpread: [1],
  noWorkoutsByQuery: false,
};

export const workoutReducer = (state = init, action) => {
  switch (action.type) {
    case a.SET_WORKOUTS: {
      /*
       When pages are flipped and when search query is typed, routine balance stays the same
       which can be proven by comparing strings of joined muscle groups of prev and next state.
       We can use that to skip rewriting muscle groups so that we can avoid the routine balance
       state update. However, in order to completely prevent a component that uses the state
       from rerendering, we would have to violate the immutability principle.
      */

      const nextMuscleGroupsString =
        action.payload.allUserWorkoutsMuscleGroups.join("");
      const prevMuscleGroupsString = state.allUserWorkoutsMuscleGroups.join("");

      return nextMuscleGroupsString === prevMuscleGroupsString
        ? {
            ...state,
            noWorkoutsByQuery: action.payload.noWorkoutsByQuery,
            workoutsChunk: action.payload.workoutsChunk,
            pageSpread: action.payload.pageSpread,
            total: action.payload.total,
          }
        : action.payload;
    }
    case a.CREATE_WORKOUT: {
      const newTotalCreate = ++state.total;
      return {
        ...state,
        workoutsChunk: [action.payload, ...state.workoutsChunk],
        allUserWorkoutsMuscleGroups: [
          action.payload.muscle_group,
          ...state.allUserWorkoutsMuscleGroups,
        ],
        pageSpread: pageSpreadHelper(newTotalCreate, state.limit),
      };
    }
    case a.UPDATE_WORKOUT: {
      /*
       By finding the index of the updated workout in the chunk,
       we can preserve the order of the workouts in the UI after update.
      */
      const indexInChunkOfUpdatedWorkout = state.workoutsChunk
        .map((w) => w._id)
        .indexOf(action.payload._id);

      /*
       By comparing workout's muscle group before and after update, we can
       see whether we need to rewrite muscle groups.
       Skipping this rewriting when muscle group is the same before and after
       workout update will prevent routine balance state update as well.
      */
      const prevMuscleGroupOfUpdatedWorkout = state.workoutsChunk.find(
        (e) => e._id === action.payload._id
      ).muscle_group;

      let newMuscleGroups;
      if (action.payload.muscle_group !== prevMuscleGroupOfUpdatedWorkout) {
        const prevMuscleGroupIndex = state.allUserWorkoutsMuscleGroups.indexOf(
          prevMuscleGroupOfUpdatedWorkout
        );
        newMuscleGroups = state.allUserWorkoutsMuscleGroups.with(
          prevMuscleGroupIndex,
          action.payload.muscle_group
        );
      }
      return action.payload.muscle_group !== prevMuscleGroupOfUpdatedWorkout
        ? {
            ...state,
            allUserWorkoutsMuscleGroups: newMuscleGroups,
            workoutsChunk: state.workoutsChunk.with(
              indexInChunkOfUpdatedWorkout,
              action.payload
            ),
          }
        : {
            ...state,
            workoutsChunk: state.workoutsChunk.with(
              indexInChunkOfUpdatedWorkout,
              action.payload
            ),
          };
    }
    case a.DELETE_WORKOUT: {
      const newTotalDelete = --state.total;
      const newWorkoutsChunk = state.workoutsChunk.filter(
        (e) => e._id !== action.payload._id
      );
      const prevMuscleGroupIndex = state.allUserWorkoutsMuscleGroups.indexOf(
        state.workoutsChunk.find((e) => e._id === action.payload._id)
          .muscle_group
      );
      return {
        ...state,
        total: newTotalDelete,
        allUserWorkoutsMuscleGroups:
          state.allUserWorkoutsMuscleGroups.toSpliced(prevMuscleGroupIndex, 1),
        workoutsChunk: newWorkoutsChunk,
        pageSpread: pageSpreadHelper(newTotalDelete, state.limit),
      };
    }
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
