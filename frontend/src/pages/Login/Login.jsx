import { Suspense, lazy, useEffect, useRef } from "react";
import { useLogin } from "../../hooks";
import { useSelector, useDispatch } from "react-redux";

const ForgotPasswordForm = lazy(() =>
  import("../../components").then((module) => ({
    default: module.ForgotPasswordForm,
  }))
);

const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader);
  const { isForgotPasswordFormMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const email = useRef();
  const password = useRef();
  const { login } = useLogin();

  useEffect(() => {
    if (process.env.NODE_ENV !== "test") {
      email.current.value = "guest@wm.app";
      password.current.value = "abcABC123!";
    }
  }, [email, password]);

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
          <button className="log-in--form--btn" disabled={loading.user}>
            Log in
          </button>
          {loading.user && (
            <div className="loader--container">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
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
