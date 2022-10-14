import React from 'react';
import {Link} from 'react-router-dom';
import Welcome from '../components/Welcome';


export default function LandingPage(){
    console.log('landing page rendered')

    return(
        <div className='landing'>  
            <Welcome />
            <Link to="/home">
                    <p>home page</p>
                </Link>
            <div className="landing--btns">
            <Link to="/login">
                <span className="login--btn">Log In</span>
            </Link>
            <Link to="/signup">
                <span className="signup--btn">Sign Up</span>
            </Link>
            </div>
        </div>
    )
}