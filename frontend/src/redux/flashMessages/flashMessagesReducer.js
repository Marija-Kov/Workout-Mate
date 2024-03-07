const ERROR = "ERROR";
const SUCCESS = "SUCCESS";
const RESET_FLASH_MESSAGES = "RESET_FLASH_MESSAGES";

const init = {
  error: null,
  success: null,
};

export const flashMessagesReducer = (state = init, action) => {
  switch (action.type) {
    case ERROR:
      return {
        error: action.payload,
        success: null,
      };
    case SUCCESS:
      return {
        error: null,
        success: action.payload,
      };
    case RESET_FLASH_MESSAGES:
      return init;
    default:
      return state;
  }
};
