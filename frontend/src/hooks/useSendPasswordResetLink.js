import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export default function useSendPasswordResetLink() {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const sendPasswordResetLink = async (email) => {
    dispatch({ type: "SET_LOADER" });
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
        ) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Please enter valid email address");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
        }),
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
  
  return { sendPasswordResetLink };
}
