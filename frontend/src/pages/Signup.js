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
    const credentials = {
      email: email.current.value,
      password: password.current.value,
    };
    await signup(credentials);
  };

  return (
    <div className="form--container--signup">
      <h1>
        <p></p>
      </h1>
      <form
        className="signup"
        onSubmit={handleSubmit}
      >
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
        <button className="sign-up--form--btn" disabled={loading}>
          Sign up
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
      </form>
    </div>
  );
};
export default Signup;
