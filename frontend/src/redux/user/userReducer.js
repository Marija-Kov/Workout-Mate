const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const UPDATE_USER = "UPDATE_USER";

const init = JSON.parse(localStorage.getItem("user")) || null;

export const userReducer = (state = init, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      return null;
    case UPDATE_USER:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
