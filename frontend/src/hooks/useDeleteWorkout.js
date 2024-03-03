import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useDeleteWorkout() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const { user } = useSelector((state) => state.user);
  const { workouts } = useSelector((state) => state.workout);
  const page = useSelector((state) => state.page);
  const { workoutsChunk, allUserWorkoutsMuscleGroups, total } = workouts;

  const deleteWorkout = async (id) => {
    dispatch({ type: "DELETE_WORKOUT_REQ" });
    if (!user) {
      return flashMessage("DELETE_WORKOUT_FAIL", "Not authorized");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/workouts/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      dispatch({
        type: "SET_ROUTINE_BALANCE",
        payload: allUserWorkoutsMuscleGroups,
      });
      if (workoutsChunk.length === 1 && page === 0) {
        if (total > 1) {
          dispatch({ type: "NEXT_PAGE" });
          setTimeout(() => {
            dispatch({ type: "PREV_PAGE" });
          }, 50);
        }
      }
      if (workoutsChunk.length === 1 && page > 0) {
        dispatch({ type: "PREV_PAGE" });
      }
      return dispatch({ type: "DELETE_WORKOUT_SUCCESS", payload: json.workout });
    }
    if (!response.ok) {
      return flashMessage("DELETE_WORKOUT_FAIL", json.error);
    }
  };
  
  return { deleteWorkout };
}
