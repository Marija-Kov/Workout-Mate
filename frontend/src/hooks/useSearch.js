import { useSelector, useDispatch } from "react-redux";

export const useSearch = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const search = async (query, page) => {
    dispatch({ type: "SET_WORKOUTS_REQ" });
    if (!user) {
      dispatch({ type: "SET_WORKOUTS_FAIL", payload: "Not authorized" });
      return;
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
      dispatch({ type: "SET_WORKOUTS_SUCCESS", payload: json });
    }
    if (!response.ok) {
      dispatch({ type: "SET_WORKOUTS_FAIL", payload: json.error });
      setTimeout(() => {
        dispatch({ type: "RESET_ERROR_MESSAGES" });
      }, 5000);
    }
  };

  return { search };
};
