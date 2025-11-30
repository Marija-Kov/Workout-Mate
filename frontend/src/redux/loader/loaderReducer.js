const SET_WORKOUTS_LOADER = "SET_WORKOUTS_LOADER";
const UNSET_WORKOUTS_LOADER = "UNSET_WORKOUTS_LOADER";
const SET_USER_LOADER = "SET_USER_LOADER";
const UNSET_USER_LOADER = "UNSET_USER_LOADER";
const SET_CHART_LOADER = "SET_CHART_LOADER";
const UNSET_CHART_LOADER = "UNSET_CHART_LOADER";
const UNSET_ALL_LOADERS = "UNSET_ALL_LOADERS";

const init = {
  workouts: false,
  user: false,
  chart: false,
};

export const loaderReducer = (state = init, action) => {
  switch (action.type) {
    case SET_WORKOUTS_LOADER:
      return {
        ...state,
        workouts: true,
      };
    case UNSET_WORKOUTS_LOADER:
      return {
        ...state,
        workouts: false,
      };
    case SET_USER_LOADER:
      return {
        ...state,
        user: true,
      };
    case UNSET_USER_LOADER:
      return {
        ...state,
        user: false,
      };
    case SET_CHART_LOADER:
      return {
        ...state,
        chart: true,
      };
    case UNSET_CHART_LOADER:
      return {
        ...state,
        chart: false,
      };
    case UNSET_ALL_LOADERS:
      return init;
    default:
      return init;
  }
};
