import React from 'react';
import { useLogin } from '../hooks/useLogin';
import Navbar from "../components/Navbar";

const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {login, isLoading, error} = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    }

    return (
      <>
      <Navbar />
      <div className='form--container'>
        <h1>
          We got your back. 
          <p>And your quads.</p></h1>
        <form className='login' onSubmit={handleSubmit}>
          <h4>User Login</h4>
          <label>username:</label>
          <input 
            type="text" 
            placeholder="username"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            />
        <label>password:</label>
          <input 
            type="password" 
            placeholder="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            />
            <button disabled={isLoading}>Log in</button>
            {error && <div className="error">{error}</div>} 
        </form>
      </div>
      </>
    )

}
export default Login;