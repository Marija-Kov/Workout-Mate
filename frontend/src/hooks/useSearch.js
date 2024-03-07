import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useSearch = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const search = async (query, page) => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/workouts/?search=${query}&p=${page}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return dispatch({ type: "SET_WORKOUTS", payload: json });
    }
    if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
  };

  return { search };
};
