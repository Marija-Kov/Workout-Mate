import * as a from "./userActionTypes";

const init = {
 user: JSON.parse(localStorage.getItem("user")) || null,
 loading: false,
 signupError: null,
 confirmAccountError: null,
 loginError: null,
 updateUserError: null,
 deleteUserError: null,
 success: false
};

export const userReducer = (state = init, action) => {
    switch (action.type) {
      case a.SIGNUP_REQ:
        return {
          ...state,
          loading: true,
        };
      case a.SIGNUP_SUCCESS:
        return {
          ...state,
          loading: false,
          success: action.payload,
          signupError: null
        };
      case a.SIGNUP_FAIL:
        return {
          ...state,
          loading: false,
          success: false,
          signupError: action.payload
        };
      case a.CONFIRM_ACCOUNT_REQ:
        return {
          ...state,
          loading: true,
        };
      case a.CONFIRM_ACCOUNT_SUCCESS:
        return {
          ...state,
          loading: false,
          success: action.payload,
          confirmAccountError: null
        };
      case a.CONFIRM_ACCOUNT_FAIL:
        return {
          ...state,
          loading: false,
          confirmAccountError: action.payload
        };
      case a.LOGIN_REQ:
        return {
          ...state,
          loading: true,
        };
      case a.LOGIN_SUCCESS:
        return {
          user: action.payload,
          loading: false,
          loginError: null
        };
      case a.LOGIN_FAIL:
        return {
          user: null,
          loading: false,
          loginError: action.payload,
        };
      case a.LOGOUT:
        return {
          ...state,
          user: null,
          loading: false,
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
          updateUserError:null,
          success: action.payload.success
        };
      case a.UPDATE_USER_FAIL:
        return {
          ...state,
          loading: false,
          updateUserError: action.payload,
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
          deleteUserError: null,
          success: action.payload
        };
      case a.DELETE_USER_FAIL:
        return {
          ...state,
          loading: false,
          deleteUserError: action.payload
        };
      default:
        return state;
    }

}

export default userReducer