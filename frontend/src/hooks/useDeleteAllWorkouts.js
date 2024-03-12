import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useDeleteAllWorkouts = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);

  const deleteAllWorkouts = async () => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(`${process.env.REACT_APP_API}/api/workouts/`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      dispatch({ type: "RESET_WORKOUTS_STATE" });
      return flashMessage("SUCCESS", "Successfully deleted all workouts");
    }
    if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Could not delete workouts");
    }
  };

  return { deleteAllWorkouts };
};
