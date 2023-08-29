import * as a from "./userActionTypes";

const init = {
 user: JSON.parse(localStorage.getItem("user")) || null,
 loading: false,
 error: null,
 success: false
};

export const userReducer = (state = init, action) => {
    switch (action.type) {
      case a.LOGIN_REQ:
        return {
          ...state,
          loading: true,
        };
      case a.LOGIN_SUCCESS:
        return {
          user: action.payload,
          loading: false,
          error: null
        };
      case a.LOGIN_FAIL:
        return {
          user: null,
          loading: false,
          error: action.payload,
          success: null
        };
      case a.LOGOUT:
        return {
          user: null,
          loading: false,
          error: null
        };
      case a.UPDATE_USER_REQ:
        return {
          ...state,
          loading: true,
        };
      case a.UPDATE_USER_SUCCESS:
        return {
          user: action.payload.user,
          loading: false,
          error: null,
          success: action.payload.success
        };
      case a.UPDATE_USER_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
          success: null
        };
      case a.DELETE_USER_REQ:
        return {
          ...state,
          loading: true,
        };
      case a.DELETE_USER_SUCCESS:
        return {
          user: null, 
          loading: false,
          error: null,
          success: action.payload
        };
      case a.DELETE_USER_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }

}

export default userReducer