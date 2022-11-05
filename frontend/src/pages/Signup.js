import React from 'react';
import { useSignup } from '../hooks/useSignup';
import Navbar from "../components/Navbar";

const Signup = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {signup, isLoading, error} = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(username, password);
    }

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
            <label>username:</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>password:</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </>
    );

}
export default Signup;