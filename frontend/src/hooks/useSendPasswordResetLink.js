import { useDispatch } from "react-redux";

export default function useSendPasswordResetLink() {
  const dispatch = useDispatch();

  const sendPasswordResetLink = async (email) => {
    dispatch({ type: "SEND_PASSWORD_RESET_LINK_REQ" });

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      dispatch({
        type: "SEND_PASSWORD_RESET_LINK_FAIL",
        payload: "Please enter valid email address",
      });
      setTimeout(() => {
        dispatch({ type: "RESET_USER_STATE" });
      }, 5000);
      return;
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
      dispatch({ type: "SEND_PASSWORD_RESET_LINK_FAIL", payload: json.error });
      setTimeout(() => {
        dispatch({ type: "RESET_USER_STATE" });
      }, 5000);
      return;
    }
    if (response.ok) {
      dispatch({
        type: "SEND_PASSWORD_RESET_LINK_SUCCESS",
        payload: json.success,
      });
    }
  };

  return { sendPasswordResetLink };
}
