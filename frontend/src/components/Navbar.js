import React from 'react';
import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Navbar(){
    const { user } = useAuthContext();
//    const [dropdown, setDropdown] = React.useState(false);
   const { logout } = useLogout();
//    function setDrop(){
//        setDropdown(prev => !prev)
//    }
   const handleClick = () => {
      logout()
   }
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>WorkoutMate</h1>
                </Link>
                {user && <div>
                    <span>Hello, {user.username}!</span>
                    <span className='logout' onClick={handleClick}>Log Out</span>
                          </div>}
                {!user && <div>
                     <span className="login--btn"><Link to="/login">Log In</Link></span>
                     <span className="signup--btn"><Link to="/signup">Sign Up</Link></span>
                          </div>}
                {/* <span className='material-symbols-outlined ham'
                      onClick={()=>setDrop()}>
                    menu
                </span> */}

            </div>
        </header>
    )
}