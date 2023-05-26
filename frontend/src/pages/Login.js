import React, { Suspense } from 'react';
import { useLogin } from '../hooks/useLogin';

const ForgotPasswordForm = React.lazy(() =>
  import("../components/ForgotPasswordForm")
);

const Login = () => {
    const [credentials, setCredentials] = React.useState({email:'', password:''})
    const {login, isLoading, error} = useLogin();
    const [forgotPasswordForm, setForgotPasswordForm] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(credentials);
    }

    const forgotPassword = () => {
      setForgotPasswordForm(prev=>!prev)
    }

      const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      };
    return (
      <>
        <div className="form--container--login">
          <h1>
            <p></p>
          </h1>
          <form aria-label="log in" className="login" onSubmit={handleSubmit}>
            <h4>User Login</h4>
            <label>email address:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="email address"
              aria-label="email address"
              value={credentials.email}
              onChange={handleChange}
            />
            <label>password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              aria-label="password"
              value={credentials.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="forgot--password"
              onClick={forgotPassword}
            >
              Forgot the password?
            </button>
            <button className="log-in--form--btn" disabled={isLoading}>
              Log in
            </button>
            {isLoading && (
              <div className="loader--container">
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            {error && (
              <div role="alert" className="error">
                {error}
              </div>
            )}
          </form>
        </div>

        {forgotPasswordForm && (
          <Suspense>
            <ForgotPasswordForm forgotPassword={forgotPassword} />
          </Suspense>
        )}
      </>
    );

}
export default Login;