import React from "react";
import useSendPasswordResetRequest from '../hooks/useSendPasswordResetRequest'

export default function ForgotPasswordForm({ forgotPassword }) {
  const { sendPasswordResetRequest, error, success } =
    useSendPasswordResetRequest();
  const email = React.useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    await sendPasswordResetRequest(email.current.value)
  };

  return (
    <div className="form--container--reset--password--request">
      <form aria-label="forgot password form" className="reset--password--request" onSubmit={sendEmail}>
        <span
          aria-label= "close forgot password form"
          className="close material-symbols-outlined"
          onClick={() => forgotPassword()}
        >
          close
        </span>
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
        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
