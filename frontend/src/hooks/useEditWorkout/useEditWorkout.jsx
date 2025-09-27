import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "../";

const useEditWorkout = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const user = useSelector((state) => state.user);
  const workouts = useSelector((state) => state.workouts);
  const { allUserWorkoutsMuscleGroups } = workouts;
  const url = import.meta.env.VITE_API || "http://localhost:6060";

  const editWorkout = async (id, payload) => {
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    if (payload.title && !payload.title.match(/^[a-zA-Z\s]*$/)) {
      return flashMessage("ERROR", "Title may contain only letters");
    }
    if (payload.title && payload.title.length > 30) {
      return flashMessage("ERROR", "Too long title - max 30 characters");
    }
    if (
      payload.muscle_group &&
      ![
        "chest",
        "shoulder",
        "biceps",
        "triceps",
        "leg",
        "back",
        "glute",
        "ab",
        "calf",
        "forearm and grip",
      ].includes(payload.muscle_group)
    ) {
      return flashMessage("ERROR", "Invalid muscle group value");
    }
    if (payload.reps && payload.reps > 9999) {
      return flashMessage("ERROR", "Reps value too large");
    }
    if (payload.load && payload.load > 9999) {
      return flashMessage("ERROR", "Load value too large");
    }
    const response = await fetch(`${url}/api/workouts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
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
      flashMessage("SUCCESS", "Successfully updated workout");
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
      /*
       Update routine balance only if muscle group has changed:
      */
      if (payload.muscle_group && payload.muscle_group !== json.muscle_group) {
        dispatch({
          type: "SET_ROUTINE_BALANCE",
          payload: allUserWorkoutsMuscleGroups,
        });
      }
      return dispatch({ type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM" });
    }
  };

  return { editWorkout };
}

export default useEditWorkout
