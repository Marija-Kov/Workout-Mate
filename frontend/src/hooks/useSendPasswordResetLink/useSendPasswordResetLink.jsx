import { useDispatch } from "react-redux";
import { useFlashMessage } from "../";

const useSendPasswordResetLink = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = import.meta.env.VITE_API || "http://localhost:6060";

  const sendPasswordResetLink = async (email) => {
    dispatch({ type: "SET_USER_LOADER" });
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      return flashMessage("ERROR", "Please enter valid email address");
    }
    const response = await fetch(`${url}/api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      dispatch({ type: "TOGGLE_MOUNT_FORGOT_PASSWORD_FORM" });
      return flashMessage("SUCCESS", json.success);
    }
  };

  return { sendPasswordResetLink };
};

export default useSendPasswordResetLink;
