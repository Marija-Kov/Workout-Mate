import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useSearch = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const search = async (query, page) => {
    dispatch({ type: "SET_WORKOUTS_REQ" });
    if (!user) {
      return flashMessage("SET_WORKOUTS_FAIL", "Not authorized");
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
      return dispatch({ type: "SET_WORKOUTS_SUCCESS", payload: json });
    }
    if (!response.ok) {
      return flashMessage("SET_WORKOUTS_FAIL", json.error);
    }
  };
  
  return { search };
};
