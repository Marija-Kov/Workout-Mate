const SET_QUERY = "SET_QUERY";
const RESET_QUERY_STATE = "RESET_QUERY_STATE";

const init = "";

export const queryReducer = (state = init, action) => {
  switch (action.type) {
    case SET_QUERY:
      return action.payload;
    case RESET_QUERY_STATE:
      return init;
    default:
      return state;
  }
};
