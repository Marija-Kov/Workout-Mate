import React from 'react';
import { Link } from 'react-router-dom';
import useResetPassword from '../hooks/useResetPassword';
import { useSelector } from 'react-redux';

export default function ResetPassword(){
    const { resetPasswordError, success } = useSelector(state => state.user);
    const { resetPassword } = useResetPassword();
    const password = React.useRef();
    const confirmPassword = React.useRef();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const start = window.location.href.indexOf('=')+1;
      const token = window.location.href.slice(start);
      await resetPassword(token, password.current.value, confirmPassword.current.value)
    }

    return (
      <div className="form--container--reset--password">
        <form className="reset--password" onSubmit={handleSubmit}>
          <label>New password:</label>
          <input
            type="password"
            id="new-password"
            aria-label="new password"
            ref={password}
          />
          <label>Confirm new password:</label>
          <input
            type="password"
            id="confirm-new-password"
            aria-label="confirm new password"
            ref={confirmPassword}
          />
          {!success && <button>Save</button>}
          {resetPasswordError && (
            <div role="alert" className="error">
              {resetPasswordError}.
           
            </div>
          )}
          {resetPasswordError && resetPasswordError.match(/invalid/i) && <p><Link to="/login">Go back</Link> to resend the request.</p>}
          {success && (
            <div role="alert" className="success">
              {success}
            </div>
          )}
          {success && (
            <p>
              <Link to="/login">Log in</Link>
            </p>
          )}
        </form>
      </div>
    );

}