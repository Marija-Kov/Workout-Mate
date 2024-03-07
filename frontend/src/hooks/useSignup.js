import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useSignup = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const signup = async (credentials) => {
    dispatch({ type: "SET_LOADER" });
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
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("SUCCESS", json.success);
    }
  };

  return { signup };
};
