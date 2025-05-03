import { useRef } from "react";
import useSendPasswordResetLink from "../hooks/useSendPasswordResetLink";
import { useDispatch } from "react-redux";

export default function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const { sendPasswordResetLink } = useSendPasswordResetLink();
  const email = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    await sendPasswordResetLink(email.current.value);
  };

  return (
    <div className="form--container--forgot--password--form">
      <form className="forgot--password--form" onSubmit={sendEmail}>
        <button
          className="close material-symbols-outlined"
          onClick={() => {
            dispatch({ type: "TOGGLE_MOUNT_FORGOT_PASSWORD_FORM" });
          }}
        >
          close
        </button>
        <h4>Reset Password</h4>
        <label htmlFor="email">Please enter your email address</label>
        <input
          name="email"
          id="email"
          type="text"
          placeholder="email address"
          ref={email}
        />
        <button className="proceed">Proceed</button>
      </form>
    </div>
  );
}
