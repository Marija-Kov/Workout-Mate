import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useDeleteWorkout() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const workouts = useSelector((state) => state.workouts);
  const page = useSelector((state) => state.page);
  const { workoutsChunk, allUserWorkoutsMuscleGroups, total } = workouts;
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const deleteWorkout = async (id) => {
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(`${url}/api/workouts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = await response.json();
    if (response.ok) {
      flashMessage("SUCCESS", "Successfully deleted workout");
      dispatch({ type: "DELETE_WORKOUT", payload: json.workout });
      if (workoutsChunk.length === 1 && page === 1) {
        if (total > 1) {
          dispatch({ type: "NEXT_PAGE" });
          setTimeout(() => {
            dispatch({ type: "PREV_PAGE" });
          }, 50);
        }
      }
      if (workoutsChunk.length === 1 && page > 1) {
        dispatch({ type: "PREV_PAGE" });
      }
      return dispatch({
        type: "SET_ROUTINE_BALANCE",
        payload: allUserWorkoutsMuscleGroups,
      });
    }
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
  };

  return { deleteWorkout };
}
