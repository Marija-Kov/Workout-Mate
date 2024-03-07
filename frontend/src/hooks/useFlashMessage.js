import { useDispatch } from "react-redux";

export const useFlashMessage = () => {
  const dispatch = useDispatch();
  const flashMessage = (action, message) => {
    dispatch({ type: action, payload: message });
    setTimeout(() => {
      if (["SUCCESS", "ERROR"].includes(action)) {
        return dispatch({ type: "RESET_FLASH_MESSAGES" });
      } else if (action.includes("WORKOUT")) {
        return dispatch({ type: "RESET_WORKOUT_ERROR_MESSAGES" });
      } else {
        return dispatch({ type: "RESET_USER_MESSAGE_STATE" });
      }
    }, 5000);
  };
  return flashMessage;
};
