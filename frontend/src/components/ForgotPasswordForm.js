import React from "react";
import useSendPasswordResetLink from '../hooks/useSendPasswordResetLink'
import { useDispatch, useSelector } from "react-redux";

export default function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const { sendPasswordResetLinkError, success } = useSelector(state => state.user);
  const { sendPasswordResetLink } = useSendPasswordResetLink();
  const email = React.useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    await sendPasswordResetLink(email.current.value)
  };

  return (
    <div className="form--container--reset--password--request">
      <form aria-label="forgot password form" className="reset--password--request" onSubmit={sendEmail}>
        <button
          aria-label= "close forgot password form"
          className="close material-symbols-outlined"
          onClick={() => {
            dispatch({type: "SHOW_FORGOT_PASSWORD_FORM"})
            dispatch({type: "RESET_ERROR_AND_SUCCESS_MESSAGES"})
          }}
        >
          close
        </button>
        <h4>Reset Password</h4>
        <label>Please enter your email address</label>
        <input
          name="email"
          id="email"
          type="text"
          placeholder="email address"
          aria-label="email address"
          ref={email}
        />
        <button aria-label="submit">Proceed</button>
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
