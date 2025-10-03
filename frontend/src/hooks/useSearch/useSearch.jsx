import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "../";

const useSearch = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = import.meta.env.VITE_API || "http://localhost:6060";

  const search = useCallback(
    async (query, page) => {
      dispatch({ type: "SET_WORKOUTS_LOADER" });
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
    },
    [url, user, dispatch, flashMessage]
  );

  return { search };
};

export default useSearch;
