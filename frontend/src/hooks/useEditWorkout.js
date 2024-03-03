import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useEditWorkout() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const { user } = useSelector((state) => state.user);
  const { workouts } = useSelector((state) => state.workout);
  const { allUserWorkoutsMuscleGroups } = workouts;

  const editWorkout = async (id, payload) => {
    dispatch({ type: "UPDATE_WORKOUT_REQ" });
    if (!user) {
      return flashMessage("UPDATE_WORKOUT_FAIL", "You must be logged in");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/workouts/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("UPDATE_WORKOUT_FAIL", json.error);
    }
    if (response.ok) {
      dispatch({ type: "UPDATE_WORKOUT_SUCCESS", payload: json });
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
