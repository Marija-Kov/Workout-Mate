import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useLogin = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_REQ" });
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("LOGIN_FAIL", json.error);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      return dispatch({ type: "LOGIN_SUCCESS", payload: json });
    }
  };
  
  return { login };
};
