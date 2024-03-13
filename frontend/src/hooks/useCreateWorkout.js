import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useCreateWorkout = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const workouts = useSelector((state) => state.workouts);
  const { allUserWorkoutsMuscleGroups } = workouts;

  const createWorkout = async (workout) => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Not authorized");
    }

    const response = await fetch(`${process.env.REACT_APP_API}/api/workouts`, {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      flashMessage("SUCCESS", "Successfully created workout");
      dispatch({ type: "CREATE_WORKOUT", payload: json });
      dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 0 });
      dispatch({
        type: "SET_ROUTINE_BALANCE",
        payload: [workout.muscle_group, ...allUserWorkoutsMuscleGroups],
      });
      return dispatch({ type: "TOGGLE_MOUNT_CREATE_WORKOUT_FORM" });
    }
  };

  return { createWorkout };
};
