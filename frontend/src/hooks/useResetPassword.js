import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useResetPassword() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const resetPassword = async (token, password, confirmPassword) => {
    dispatch({ type: "RESET_PASSWORD_REQ" });
    if (!token) {
      return flashMessage(
        "RESET_PASSWORD_FAIL",
        "Reset password token not found"
      );
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/reset-password/${token}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          password: password,
          confirmPassword: confirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("RESET_PASSWORD_FAIL", json.error);
    } else if (response.ok) {
      return dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: json.success });
    }
  };

  return { resetPassword };
}
