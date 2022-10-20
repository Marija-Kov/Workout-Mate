import React from 'react';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {signup, isLoading, error} = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(username, password);
    }

    return (
        <form className='signup' onSubmit={handleSubmit}>
          <h4>Sign up form</h4>
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
            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>} 
        </form>
    )

}
export default Signup;