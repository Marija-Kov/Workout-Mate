import React, { Suspense } from "react";
import { useLogin } from "../hooks/useLogin";
import { useSelector, useDispatch } from "react-redux";

const ForgotPasswordForm = React.lazy(() =>
  import("../components/ForgotPasswordForm")
);

const Login = () => {
  const dispatch = useDispatch();
  const { loginError, loading } = useSelector((state) => state.user);
  const { isForgotPasswordFormMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const email = React.useRef();
  const password = React.useRef();
  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      email: email.current.value,
      password: password.current.value,
    };
    await login(credentials);
  };

  return (
    <>
      <div className="form--container--login">
        <h1>
          <p></p>
        </h1>
        <form className="login" onSubmit={handleSubmit}>
          <h4>User Login</h4>
          <label htmlFor="email">email address:</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="email address"
            ref={email}
          />
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            ref={password}
          />
          <button
            type="button"
            className="forgot--password"
            onClick={() =>
              dispatch({ type: "TOGGLE_MOUNT_FORGOT_PASSWORD_FORM" })
            }
          >
            Forgot the password?
          </button>
          <button className="log-in--form--btn" disabled={loading}>
            Log in
          </button>
          {loading && (
            <div className="loader--container">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {loginError && (
            <div role="alert" className="error">
              {loginError}
            </div>
          )}
        </form>
      </div>

      {isForgotPasswordFormMounted && (
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      )}
    </>
  );
};
export default Login;
