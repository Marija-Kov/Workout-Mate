import React from 'react';
import { Link } from 'react-router-dom';
import useResetPassword from '../hooks/useResetPassword';

export default function ResetPassword(){
    const { resetPassword, error, success } = useResetPassword();
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [token, setToken] = React.useState(null);

    React.useEffect(()=> {
      const start = window.location.href.indexOf('=')+1;
      setToken(window.location.href.slice(start))
    }, [])

    const handleSubmit = async (e) => {
      e.preventDefault();
      await resetPassword(token, password, confirmPassword)
    }
    return (
      <div className="form--container">
        <form className="reset--password" onSubmit={handleSubmit}>
          <label>New password:</label>
          <input
            type="password"
            id="new-password"
            aria-label="new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Confirm new password:</label>
          <input
            type="password"
            id="confirm-new-password"
            aria-label="confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {!success && <button>Save</button>}
          {error && (
            <div role="alert" className="error">
              {error}.<br></br>
            <Link to="/login">Go back</Link> to resend the request.
            </div>
          )}
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