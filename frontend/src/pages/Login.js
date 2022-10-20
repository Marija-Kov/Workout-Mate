import React from 'react';

const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(username, password)
    }

    return (
        <form className='login' onSubmit={handleSubmit}>
          <h4>Log in form</h4>
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
            <button>Log in</button>
        </form>
    )

}
export default Login;