import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useResetPassword() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const resetPassword = async (token, password, confirmPassword) => {
    dispatch({ type: "SET_LOADER" });
    if (!token) {
      return flashMessage("ERROR", "Reset password token not found");
    }
    if (
      !password.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/
      )
    ) {
      return flashMessage("ERROR", "Password not strong enough");
    }
    if (password !== confirmPassword) {
      return flashMessage("ERROR", "Passwords must match");
    }
    const response = await fetch(`${url}/api/reset-password/${token}`, {
      method: "PATCH",
      body: JSON.stringify({
        password: password,
        confirmPassword: confirmPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      return flashMessage("SUCCESS", json.success);
    }
  };

  return { resetPassword };
}
