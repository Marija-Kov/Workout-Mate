import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "../";

const useDeleteWorkout = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const workouts = useSelector((state) => state.workouts);
  const page = useSelector((state) => state.page);
  const { workoutsChunk, allUserWorkoutsMuscleGroups, total } = workouts;
  const url = import.meta.env.VITE_API || "http://localhost:6060";

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
      /* 
        After deleting the last workout from a page, it flips to the previous page.
      */
      if (workoutsChunk.length === 1 && page > 1) {
        dispatch({ type: "PREV_PAGE" });
      }
      /* 
        In case when the previous page does not exist i.e. the current page is 1,
        we fetch the next page to allow the DB to update before we re-fetch the 
        first page with the new chunk (all chunks are effectively shifted 
        to the left by 1 page after the deletion).
      */
      if (workoutsChunk.length === 1 && page === 1) {
        if (total > 1) {
          dispatch({ type: "NEXT_PAGE" });
          setTimeout(() => {
            dispatch({ type: "PREV_PAGE" });
          });
        }
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
};

export default useDeleteWorkout;
