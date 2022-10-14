import React from 'react';

export default function SignUp(props){

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
            <button onClick={()=>props.showSignup()}>No, thanks.</button>
        </form>

    )
}