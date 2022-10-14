import React from 'react';

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
            <button onClick={()=>props.showLogin()}>Not right now.</button>
        </form>

    )
}