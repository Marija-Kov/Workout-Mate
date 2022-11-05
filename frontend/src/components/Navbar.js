import React from 'react';
import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import Search from './Search';

export default function Navbar({page, setPage}){
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
        <header className={user ? "header--blur" : ""}>
            <div className="container">
                 <h1>
                <Link to="/">WorkoutMate</Link>
                </h1>
                {user && <Search page={page} setPage={setPage} />}
                {user && <div>
                    <span className="hello--user">Hello, <strong>{user.username}</strong> !</span>
                    <span className='logout--btn' onClick={handleClick}>Log Out</span>
                          </div>}
                {!user && <div>
                     <Link to="/login"><span className="login--btn">Log In</span></Link>
                     <Link to="/signup"><span className="signup--btn">Sign Up</span></Link>
                          </div>}
                {/* <span className='material-symbols-outlined ham'
                      onClick={()=>setDrop()}>
                    menu
                </span> */}

            </div>
        </header>
    )
}