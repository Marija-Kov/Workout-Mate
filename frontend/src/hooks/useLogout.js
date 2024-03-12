import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useLogout = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const logout = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/logout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logout: true }),
        credentials: "include"
      }
    );
    if(!response.ok) {
      return flashMessage("ERROR", "Could not log out");
    }
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
    dispatch({ type: "RESET_WORKOUTS_STATE" });
    dispatch({ type: "RESET_ROUTINE_BALANCE_STATE"});
    dispatch({ type: "RESET_COMPONENTS_STATE" });
    dispatch({ type: "RESET_PAGE_STATE" });
    dispatch({ type: "RESET_QUERY_STATE"});
    return
  };
  return { logout };
};
