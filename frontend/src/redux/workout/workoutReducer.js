import * as a from "./workoutActionTypes";

const init = {
  workouts: {
    total: 0,
    limit: 3,
    allUserWorkoutsMuscleGroups: [],
    workoutsChunk: [],
    pageSpread: [1],
  },
  loading: false,
  setWorkoutsError: null,
  createWorkoutError: null,
  updateWorkoutError: null,
  deleteWorkoutError: null,
};

export const workoutReducer = (state = init, action) => {
  switch (action.type) {
    case a.SET_WORKOUTS_REQ:
      return {
        ...state,
        loading: true,
      };
    case a.SET_WORKOUTS_SUCCESS:
      return {
        workouts: action.payload,
        loading: false,
        setWorkoutsError: null,
      };
    case a.SET_WORKOUTS_FAIL:
      return {
        ...state,
        loading: false,
        setWorkoutsError: action.payload,
      };
    case a.CREATE_WORKOUT_REQ:
      return {
        ...state,
        loading: true,
      };
    case a.CREATE_WORKOUT_SUCCESS:
      ++state.workouts.total;
      return {
        workouts: {
          ...state.workouts,
          workoutsChunk: [action.payload, ...state.workouts.workoutsChunk],
          allUserWorkoutsMuscleGroups: [
            action.payload.muscle_group,
            ...state.workouts.allUserWorkoutsMuscleGroups,
          ],
          pageSpread: pageSpreadHelper(
            state.workouts.total,
            state.workouts.limit
          ),
        },
        loading: false,
        createWorkoutError: null,
      };
    case a.CREATE_WORKOUT_FAIL:
      return {
        ...state,
        loading: false,
        createWorkoutError: action.payload,
      };
    case a.UPDATE_WORKOUT_REQ:
      return {
        ...state,
        loading: true,
      };
    case a.UPDATE_WORKOUT_SUCCESS:
      if (action.payload.muscle_group) {
        const prevMuscleGroupIndex =
          state.workouts.allUserWorkoutsMuscleGroups.indexOf(
            state.workouts.workoutsChunk.filter(
              (e) => e._id === action.payload._id
            )[0].muscle_group
          );
        state.workouts.allUserWorkoutsMuscleGroups.splice(
          prevMuscleGroupIndex,
          1
        );
      }
      state.workouts.workoutsChunk = state.workouts.workoutsChunk.filter(
        (e) => e._id !== action.payload._id
      );
      const updateMuscleGroups = action.payload.muscle_group
        ? [
            ...state.workouts.allUserWorkoutsMuscleGroups,
            action.payload.muscle_group,
          ]
        : state.workouts.allUserWorkoutsMuscleGroups;
      return {
        workouts: {
          ...state.workouts,
          allUserWorkoutsMuscleGroups: updateMuscleGroups,
          workoutsChunk: [action.payload, ...state.workouts.workoutsChunk],
        },
        loading: false,
        updateWorkoutError: null,
      };
    case a.UPDATE_WORKOUT_FAIL:
      return {
        ...state,
        loading: false,
        updateWorkoutError: action.payload,
      };
    case a.DELETE_WORKOUT_REQ:
      return {
        ...state,
        loading: true,
      };
    case a.DELETE_WORKOUT_SUCCESS:
      --state.workouts.total;
      const newWorkoutsChunk = state.workouts.workoutsChunk.filter(
        (e) => e._id !== action.payload._id
      );
      const prevMuscleGroupIndex =
        state.workouts.allUserWorkoutsMuscleGroups.indexOf(
          state.workouts.workoutsChunk.filter(
            (e) => e._id === action.payload._id
          )[0].muscle_group
        );
      state.workouts.allUserWorkoutsMuscleGroups.splice(
        prevMuscleGroupIndex,
        1
      );
      return {
        workouts: {
          ...state.workouts,
          workoutsChunk: newWorkoutsChunk,
          pageSpread: pageSpreadHelper(
            state.workouts.total,
            state.workouts.limit
          ),
        },
        loading: false,
        deleteWorkoutError: null,
      };
    case a.DELETE_WORKOUT_FAIL:
      return {
        ...state,
        loading: false,
        deleteWorkoutError: action.payload,
      };
    case a.DELETE_ALL_WORKOUTS_REQ:
      return {
        ...state,
        loading: true,
      };
    case a.DELETE_ALL_WORKOUTS_SUCCESS:
      return {
        workouts: {
          total: 0,
          limit: 3,
          allUserWorkoutsMuscleGroups: [],
          workoutsChunk: [],
          pageSpread: [1],
        },
        loading: false,
        deleteAllWorkoutsSuccess: true,
        deleteAllWorkoutsError: null,
      };
    case a.DELETE_ALL_WORKOUTS_FAIL:
      return {
        ...state,
        loading: false,
        deleteAllWorkoutsError: action.payload,
      };
    case a.RESET_WORKOUT_ERROR_MESSAGES:
      return {
        ...state,
        setWorkoutsError: null,
        createWorkoutError: null,
        updateWorkoutError: null,
        deleteWorkoutError: null,
      };
    case a.RESET_WORKOUT_STATE:
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
