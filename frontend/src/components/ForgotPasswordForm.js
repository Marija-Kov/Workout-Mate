import React from "react";
import useSendPasswordResetLink from "../hooks/useSendPasswordResetLink";
import { useDispatch, useSelector } from "react-redux";

export default function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const { sendPasswordResetLinkError, success } = useSelector(
    (state) => state.user
  );
  const { sendPasswordResetLink } = useSendPasswordResetLink();
  const email = React.useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    await sendPasswordResetLink(email.current.value);
  };

  return (
    <div className="form--container--reset--password--request">
      <form className="reset--password--request" onSubmit={sendEmail}>
        <button
          className="close material-symbols-outlined"
          onClick={() => {
            dispatch({ type: "TOGGLE_MOUNT_FORGOT_PASSWORD_FORM" });
            dispatch({ type: "RESET_USER_STATE" });
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
        {success && (
          <div role="alert" className="success">
            {success}
          </div>
        )}
        {sendPasswordResetLinkError && (
          <div role="alert" className="error">
            {sendPasswordResetLinkError}
          </div>
        )}
      </form>
    </div>
  );
}
