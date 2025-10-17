import * as a from "./workoutActionTypes";

const init = {
  foundCount: 0, // total number of workouts or the number of workouts found upon a search query
  limit: 3, // this is a placeholder, the value is received from the server
  allMuscleGroups: [],
  chunk: [],
  pageNumbers: [1],
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

      const nextMuscleGroupsString = action.payload.allMuscleGroups.join("");
      const prevMuscleGroupsString = state.allMuscleGroups.join("");

      return nextMuscleGroupsString === prevMuscleGroupsString
        ? {
            ...state,
            noWorkoutsByQuery: action.payload.noWorkoutsByQuery,
            chunk: action.payload.chunk,
            pageNumbers: action.payload.pageNumbers,
            foundCount: action.payload.foundCount,
          }
        : action.payload;
    }
    case a.CREATE_WORKOUT: {
      const newCount = ++state.foundCount;
      return {
        ...state,
        chunk: [action.payload, ...state.chunk],
        allMuscleGroups: [
          action.payload.muscle_group,
          ...state.allMuscleGroups,
        ],
        pageNumbers: pageNumbersGenerator(newCount, state.limit),
      };
    }
    case a.UPDATE_WORKOUT: {
      /*
       By finding the index of the updated workout in the chunk,
       we can preserve the order of the workouts in the UI after update.
      */
      const indexInChunkOfUpdatedWorkout = state.chunk
        .map((w) => w._id)
        .indexOf(action.payload._id);

      /*
       By comparing workout's muscle group before and after update, we can
       see whether we need to rewrite muscle groups.
       Skipping this rewriting when muscle group is the same before and after
       workout update will prevent routine balance state update as well.
      */
      const prevMuscleGroupOfUpdatedWorkout = state.chunk.find(
        (e) => e._id === action.payload._id
      ).muscle_group;

      let newMuscleGroups;
      if (action.payload.muscle_group !== prevMuscleGroupOfUpdatedWorkout) {
        const prevMuscleGroupIndex = state.allMuscleGroups.indexOf(
          prevMuscleGroupOfUpdatedWorkout
        );
        newMuscleGroups = state.allMuscleGroups.with(
          prevMuscleGroupIndex,
          action.payload.muscle_group
        );
      }
      return action.payload.muscle_group !== prevMuscleGroupOfUpdatedWorkout
        ? {
            ...state,
            allMuscleGroups: newMuscleGroups,
            chunk: state.chunk.with(
              indexInChunkOfUpdatedWorkout,
              action.payload
            ),
          }
        : {
            ...state,
            chunk: state.chunk.with(
              indexInChunkOfUpdatedWorkout,
              action.payload
            ),
          };
    }
    case a.DELETE_WORKOUT: {
      const newCount = --state.foundCount;
      const newChunk = state.chunk.filter((e) => e._id !== action.payload._id);
      const prevMuscleGroupIndex = state.allMuscleGroups.indexOf(
        state.chunk.find((e) => e._id === action.payload._id).muscle_group
      );
      return {
        ...state,
        foundCount: newCount,
        allMuscleGroups: state.allMuscleGroups.toSpliced(
          prevMuscleGroupIndex,
          1
        ),
        chunk: newChunk,
        pageNumbers: pageNumbersGenerator(newCount, state.limit),
      };
    }
    case a.RESET_WORKOUTS_STATE:
      return init;
    default:
      return state;
  }
};

const pageNumbersGenerator = (t, l) => {
  const pagesNum = Math.ceil(t / l);
  let spread = [];
  for (let i = 1; i <= pagesNum; ++i) {
    spread.push(i);
  }
  return spread;
};
