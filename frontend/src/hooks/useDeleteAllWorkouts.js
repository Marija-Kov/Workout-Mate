import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useDeleteAllWorkouts = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const { user } = useSelector((state) => state.user);

  const deleteAllWorkouts = async () => {
    dispatch({ type: "DELETE_ALL_WORKOUTS_REQ" });
    if (!user) {
      return flashMessage("DELETE_ALL_WORKOUTS_FAIL", "Not authorized");
    }
    const response = await fetch(`${process.env.REACT_APP_API}/api/workouts/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (response.ok) {
      dispatch({
        type: "DELETE_ALL_WORKOUTS_SUCCESS",
        payload: "All workouts deleted successfully",
      });
    }
    if (!response.ok) {
      return flashMessage(
        "DELETE_ALL_WORKOUTS_FAIL",
        "Could not delete workouts"
      );
    }
  };

  return { deleteAllWorkouts };
};
