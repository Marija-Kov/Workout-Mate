const SET_QUERY = "SET_QUERY";

const init = "";

export const queryReducer = (state = init, action) => {
  switch (action.type) {
    case SET_QUERY:
      return action.payload;
    default:
      return state;
  }
};
