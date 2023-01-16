import React from 'react';
import { useSignup } from '../hooks/useSignup';
import Navbar from "../components/Navbar";

const Signup = () => {
    const [credentials, setCredentials] = React.useState({email:"", password:""});
    const [verificationNeeded, setVerificationNeeded] = React.useState(null)
    const {signup, isLoading, error} = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(credentials);
        setVerificationNeeded(true);
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
        <Navbar />
        <div className="form--container">
          <h1>
            Meet your mate.
            <p>Flex some fiber.</p>
          </h1>
          <form className="signup" onSubmit={handleSubmit}>
            <h4>Create an account</h4>
            <label>email address:</label>
            <input
              type="text"
              name="email"
              placeholder="email address"
              value={credentials.email}
              onChange={handleChange}
            />
            <label>password:</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={credentials.password}
              onChange={handleChange}
            />
            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
            {verificationNeeded && <div className="success">
              Account created and pending confirmation. Please check your inbox.</div>}
          </form>
        </div>
      </>
    );

}
export default Signup;