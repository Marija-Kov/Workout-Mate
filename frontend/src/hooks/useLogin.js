import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useLogin = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADER" });
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "UNSET_LOADER" });
      return dispatch({ type: "LOGIN", payload: json });
    }
  };
  
  return { login };
};
