import React from 'react';
import {Link} from 'react-router-dom';

export default function LogIn(props){

    return (
        <form className="signup">
          <h4>Log in form</h4>
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
            <button>Log me in</button>
            <br></br>
            <Link to="/"><button>Not right now.</button></Link>
        </form>

    )
}