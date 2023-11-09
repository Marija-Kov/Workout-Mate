const SET_ROUTINE_BALANCE = "SET_ROUTINE_BALANCE";

const init = {
  chest: 0,
  shoulder: 0,
  biceps: 0,
  triceps: 0,
  leg: 0,
  back: 0,
  glute: 0,
  ab: 0,
  calf: 0,
  forearmAndGrip: 0,
};

const allMuscleGroups = [
  "chest",
  "shoulder",
  "biceps",
  "triceps",
  "leg",
  "back",
  "glute",
  "ab",
  "calf",
  "forearmAndGrip",
];
const len = allMuscleGroups.length;

export const routineBalanceReducer = (state = init, action) => {
  switch (action.type) {
    case SET_ROUTINE_BALANCE:
      if (action.payload.length === 0) return init;
      const muscleGroups = action.payload;
      const total = muscleGroups.length;
      const balance = {};
      for (let i = 0; i < len; ++i) {
        const group =
          (muscleGroups.filter((e) => e === allMuscleGroups[i]).length * 100) /
          total;
        balance[allMuscleGroups[i]] = group.toFixed(1);
      }
      return balance;

    default:
      return state;
  }
};
