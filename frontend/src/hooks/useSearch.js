import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useSearch = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const search = async (query, page) => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(
      `${url}/api/workouts/?search=${query}&p=${page}`,
      {
        credentials: "include",
      }
    );
    const json = await response.json();
    if (response.ok) {
      return dispatch({ type: "SET_WORKOUTS", payload: json });
    }
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
  };

  return { search };
};
