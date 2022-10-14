import React from 'react';
import {Link} from 'react-router-dom';
import SignUp from '../components/SignUp'
import LogIn from '../components/LogIn'

export default function LandingPage(){
    console.log('landing page rendered')
    const [signup, setSignup] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    function showSignup(){
        setSignup(prev => !prev)
    }
    function showLogin(){
        setLogin(prev => !prev)
    }

    return(
        <div className='landing'>
            <h1>Welcome to WorkoutMate</h1>
            <Link to="/home">
                    <p>home page</p>
                </Link>
            <div className="landing--btns">
                <span className="login--btn" onClick={()=>showLogin()}>Log In</span>
                <span className="signup--btn" onClick={()=>showSignup()}>Sign Up</span>
            </div>
            {signup && <SignUp
                         showSignup={()=>showSignup()} 
                         />}
            {login && <LogIn 
                       showLogin={()=>showLogin()} 
                      />}
        </div>
    )
}