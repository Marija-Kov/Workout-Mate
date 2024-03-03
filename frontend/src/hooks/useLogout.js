import { useDispatch } from "react-redux";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }
    if (localStorage.getItem("newImg")) {
      localStorage.removeItem("newImg");
    }
    if (localStorage.getItem("username")) {
      localStorage.removeItem("username");
    }
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "RESET_USER_MESSAGE_STATE"});
    dispatch({ type: "RESET_WORKOUT_STATE" });
    dispatch({ type: "RESET_ROUTINE_BALANCE_STATE"});
    dispatch({ type: "RESET_COMPONENTS_STATE" });
    dispatch({ type: "RESET_PAGE_STATE" });
    dispatch({ type: "RESET_QUERY_STATE"});
    return "You have been logged out";
  };
  return { logout };
};
