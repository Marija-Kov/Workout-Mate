import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useEditWorkout() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const workouts = useSelector((state) => state.workouts);
  const { allUserWorkoutsMuscleGroups } = workouts;
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const editWorkout = async (id, payload) => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(
      `${url}/api/workouts/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
      }
      );
      const json = await response.json();
      if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      flashMessage("SUCCESS", "Successfully updated workout");
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
      if (payload.muscle_group)
        dispatch({
          type: "SET_ROUTINE_BALANCE",
          payload: allUserWorkoutsMuscleGroups,
        });
      return dispatch({ type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM" });
    }
  };
  
  return { editWorkout };
}
