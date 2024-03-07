import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useResetPassword() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const resetPassword = async (token, password, confirmPassword) => {
    dispatch({ type: "SET_LOADER" });
    if (!token) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Reset password token not found");
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
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    } 
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("SUCCESS", json.success);
    }
  };

  return { resetPassword };
}
