import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useCreateWorkout = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const workouts = useSelector((state) => state.workouts);
  const { allUserWorkoutsMuscleGroups } = workouts;
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const createWorkout = async (workout) => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    if (
      !workout.title ||
      !workout.muscle_group ||
      !workout.reps ||
      !workout.load
    ) {
      return flashMessage("ERROR", "Please fill out the empty fields");
    }
    if (!workout.title.match(/^[a-zA-Z\s]*$/)) {
      return flashMessage("ERROR", "Title may contain only letters");
    }
    if (workout.title.length > 30) {
      return flashMessage("ERROR", "Too long title - max 30 characters");
    }
    if (workout.load > 9999) {
      return flashMessage("ERROR", "Load value too large");
    }
    if (workout.reps > 9999) {
      return flashMessage("ERROR", "Reps value too large");
    }
    const response = await fetch(`${url}/api/workouts`, {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
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
