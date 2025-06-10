import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useDeleteAllWorkouts = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const url = import.meta.env.REACT_APP_API || "http://localhost:6060";

  const deleteAllWorkouts = async () => {
    dispatch({ type: "SET_WORKOUTS_LOADER" });
    dispatch({ type: "SET_CHART_LOADER" });
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(`${url}/api/workouts/`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      dispatch({ type: "RESET_WORKOUTS_STATE" });
      return flashMessage("SUCCESS", "Successfully deleted all workouts");
    }
    if (!response.ok) {
      return flashMessage("ERROR", "Could not delete workouts");
    }
  };

  return { deleteAllWorkouts };
};
