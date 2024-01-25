const SET_ROUTINE_BALANCE = "SET_ROUTINE_BALANCE";
const RESET_ROUTINE_BALANCE_STATE = "SET_ROUTINE_BALANCE_STATE";

const init = {
  ab: 0,
  back: 0,
  biceps: 0,
  calf: 0,
  chest: 0,
  forearmAndGrip: 0,
  glute: 0,
  leg: 0,
  shoulder: 0,
  triceps: 0,
};

const allMuscleGroups = Object.keys(init);
const len = allMuscleGroups.length;

export const routineBalanceReducer = (state = init, action) => {
  switch (action.type) {
    case SET_ROUTINE_BALANCE:
      if (action.payload.length === 0) return init;
      const muscleGroups = action.payload;
      const total = muscleGroups.length;
      const balance = {};
      for (let i = 0; i < len; ++i) {
        const group = allMuscleGroups[i];
        const percent =
          (muscleGroups.filter(
            (e) => e.split(" ").join("") === group.toLowerCase()
          ).length *
            100) /
          total;
        balance[group] = percent.toFixed(1);
      }
      return balance;
    case RESET_ROUTINE_BALANCE_STATE:
      return init;
    default:
      return state;
  }
};
