import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useSignup = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const signup = async (credentials) => {
    dispatch({ type: "SIGNUP_REQ" });
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("SIGNUP_FAIL", json.error);
    }
    if (response.ok) {
      return flashMessage("SIGNUP_SUCCESS", json.success);
    }
  };
  
  return { signup };
};
