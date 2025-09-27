import { useDispatch } from "react-redux";
import { useFlashMessage } from "../";

const useSignup = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = import.meta.env.VITE_API || "http://localhost:6060";

  const signup = async (credentials) => {
    dispatch({ type: "SET_USER_LOADER" });
    if (!credentials.email || !credentials.password) {
      return flashMessage("ERROR", "All fields must be filled");
    }
    if (
      !credentials.email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      return flashMessage("ERROR", "Please enter valid email address");
    }
    if (
      !credentials.password.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/
      )
    ) {
      return flashMessage("ERROR", "Password not strong enough");
    }
    const response = await fetch(`${url}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      return flashMessage("SUCCESS", json.success);
    }
  };

  return { signup };
};

export default useSignup
