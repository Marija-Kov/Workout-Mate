import React from "react";
//import { useResetPassword } from '../hooks/useResetPassword'

export default function ForgotPasswordForm({ forgotPassword }) {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [email, setEmail] = React.useState("");

  const sendResetPasswordEmail = async (e) => {
    e.preventDefault();
        const response = await fetch(`api/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
          }),
        });
        const json = await response.json();
        if (!response.ok) {
          setError(json.error)
        }
        if (response.ok) {
          setSuccess(json.success)
          setError(null)
        }
  };

  return (
    <div className="form--container">
      <form className="reset--password" onSubmit={sendResetPasswordEmail}>
        <span
          className="close--user--settings material-symbols-outlined"
          onClick={() => forgotPassword()}
        >
          close
        </span>
        <h4>Reset Password</h4>
        <label>Please enter your email address</label>
        <input
          name="email"
          id="email"
          type="email"
          placeholder="email address"
          aria-label="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Proceed</button>
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
