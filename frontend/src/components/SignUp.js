import React from 'react';
import {Link} from 'react-router-dom';
import { useUsersContext } from '../hooks/useUsersContext';

export default function SignUp(props){
  console.log('signup rendered')
  const { dispatch } = useUsersContext();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const [invalidFields, setInvalidFields] = React.useState([]);
  const [success, setSuccess]=React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {username, password};
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json' // here we state that the content type is going to be JSON
       } 
    });
    const json = await response.json();
    
    if (!response.ok) {
      setError([json.errors.username, json.errors.password])
      setSuccess(false);
      if (!username || json.errors.username){
        setInvalidFields(prev => ['username', ...prev])
      }
      if (!password || json.errors.password){
        setInvalidFields(prev => ['password', ...prev])
      }  
    }
    
    if (response.ok) {
      setUsername('');
      setPassword('');
      setError(null);
      setInvalidFields([])
      console.log('new user added', json);
      dispatch({type:'CREATE_USER', payload: json});
      setSuccess(true);
    }
  }
  
    return (
      <>
        <form className="signup">
          <h4>Sign up form</h4>
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
            <button onClick={(e)=>handleSubmit(e)}>Sign me up!</button>
            <Link to="/"><button className="nothanks">No, thanks.</button></Link>
            </div>
            {error && <div className="error">{error}</div>} 
            {success &&
        <div className="success">
          Success! Now you may 
          <Link to="/login">
           <span> log in </span>  
          </Link>
          with your account.
        </div>
        }
        </form>
                
        </>

    )
}