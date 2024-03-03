import { useDispatch } from "react-redux";

export const useFlashMessage = () => {
  const dispatch = useDispatch();
  const flashMessage = (action, message) => {
    dispatch({ type: action, payload: message });
    setTimeout(() => {
      return action.includes("WORKOUT")
        ? dispatch({ type: "RESET_WORKOUT_STATE" })
        : dispatch({ type: "RESET_USER_MESSAGE_STATE" });
    }, 5000);
  };
  return flashMessage;
};
