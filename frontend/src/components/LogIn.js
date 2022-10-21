import React from 'react';
import {Link} from 'react-router-dom';
import { useUsersContext } from '../hooks/useUsersContext';

export default function LogIn(){
  console.log('login rendered')
  const { dispatch } = useUsersContext();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const [invalidFields, setInvalidFields] = React.useState([]);
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {username, password};
    const response = await fetch('/api/users');
    const json = await response.json();
    // try to fetch a single document with entered username
    // works perfectly in postman
    dispatch({type: 'GET_USER', payload: json})
  }
    

    return (
        <form className="login">
          <h4>Login form</h4>
          <label>username:</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            placeholder="username"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            className={invalidFields.includes('username') ?
                   'error' : ''}
            />
        <label>password:</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className={invalidFields.includes('password') ?
                   'error' : ''}
            />
            <div className="btns">
            <button onClick={(e)=>handleSubmit(e)}>Log me in</button>
            <Link to="/"><button className="nothanks">Maybe later</button></Link>
            </div> 
        </form>

    )
}