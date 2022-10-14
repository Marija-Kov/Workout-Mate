import React from 'react';
import {Link} from 'react-router-dom';

export default function SignUp(props){
  console.log('signup rendered')
    return (
        <form className="signup">
          <h4>Sign up form</h4>
          <label>username</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            value="username"
            />
        <label>password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            value="password"
            />
            <button>Sign me up!</button>
            <br></br>
            <Link to="/"><button>No, thanks.</button></Link>
        </form>

    )
}