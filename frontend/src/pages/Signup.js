import React from "react";
import { useSignup } from "../hooks/useSignup";
import { useSelector } from "react-redux";

const Signup = () => {
  const email = React.useRef();
  const password = React.useRef();
  const { signup } = useSignup();
  const loading = useSelector((state) => state.loader);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (process.env.NODE_ENV !== "production") {
      const credentials = {
        email: email.current.value,
        password: password.current.value,
      };
      await signup(credentials);
    }
  };

  return (
    <div className="form--container--signup">
      {process.env.NODE_ENV === "production" && (
        <h1 className="temp" style={{ zIndex: 10 }}>
          <p>Apologies, prospective User!</p>
          <p>{"We can't sign you up at the moment."}</p>
          <p>If you want to see inside, you can log in with these:</p>
          <p>
            email: <strong>guest@wm.app</strong>
          </p>
          <p>
            password: <strong>abcABC123!</strong>
          </p>
        </h1>
      )}
      <form className="signup" onSubmit={handleSubmit}>
        <h4>Create an account</h4>
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
        <button className="sign-up--form--btn" disabled={loading.user}>
          Sign up
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
  );
};
export default Signup;
