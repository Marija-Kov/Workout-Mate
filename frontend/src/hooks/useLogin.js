import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useLogin = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const login = async (credentials) => {
    dispatch({ type: "SET_USER_LOADER" });
    if (!credentials.email || !credentials.password) {
      return flashMessage("ERROR", "All fields must be filled");
    }
    if (
      credentials.email &&
      !credentials.email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      return flashMessage("ERROR", "Please enter valid email address");
    }
    const response = await fetch(`${url}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      return dispatch({ type: "LOGIN", payload: json });
    }
  };

  return { login };
};
