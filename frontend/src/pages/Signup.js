import React from 'react';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
    const email = React.useRef();
    const password = React.useRef();
    const {signup, isLoading, error, verificationNeeded} = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = { email: email.current.value, password: password.current.value };
        await signup(credentials);
    }

    return (
      <div className="form--container--signup">
        <h1>
          <p></p>
        </h1>
        <form
          aria-label="create an account"
          className="signup"
          onSubmit={handleSubmit}
        >
          <h4>Create an account</h4>
          <label>email address:</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="email address"
            aria-label="email address"
            ref={email}
          />
          <label>password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            aria-label="password"
            ref={password}
          />
          <button className="sign-up--form--btn" disabled={isLoading}>
            Sign up
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
          {!error && verificationNeeded && (
            <div role="alert" className="success">
              Account created and pending confirmation. Please check your inbox.
            </div>
          )}
        </form>
      </div>
    );

}
export default Signup;