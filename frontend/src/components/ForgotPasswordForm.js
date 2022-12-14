import React from "react";
import { useResetPassword } from '../hooks/useResetPassword'

export default function ForgotPasswordForm({ forgotPassword }) {
  const [email, setEmail] = React.useState("");
  const [emailEntered, setEmailEntered] = React.useState(false);
  const { resetPassword } = useResetPassword();

  React.useEffect(() => {
    if (email) {
      setEmailEntered(true);
    } else {
      setEmailEntered(false);
    }
  }, [email, emailEntered]);

  const sendResetPasswordEmail = async (e) => {
    e.preventDefault();
    await resetPassword(email)
  };

  return (
    <div className="form--container">
      <form className="reset--password" onSubmit={sendResetPasswordEmail}>
        <h4>Reset Password</h4>
        <label>Please enter your email address</label>
        <input
          name="email"
          type="email"
          placeholder="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={!emailEntered}>Proceed</button>
        <button type="button" onClick={() => forgotPassword()}>
          Cancel
        </button>
      </form>
    </div>
  );
}
