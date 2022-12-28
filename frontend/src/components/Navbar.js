import React from 'react';
import {Link} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Search from './Search';
import UserMenu from './UserMenu';

export default function Navbar({page, setPage}){
  const { user } = useAuthContext();
  const [showUserMenu, setShowUserMenu] = React.useState(true);
  const [username, setUsername] = React.useState('who are you?')

   function userMenu(){
       setShowUserMenu(prev => !prev)
   }

React.useEffect(()=>{
if(user){
 const i = user.email.indexOf('@');
 setUsername(`${user.email.slice(0,i)}`)
}

}, [])

    return (
      <header className={user ? "header--blur" : ""}>
        <div className="container">
          <h1>
            <Link to="/">WorkoutMate</Link>
          </h1>
          {user && <Search page={page} setPage={setPage} />}
          {user && (
            <div>
              <span className="hello--user" onClick={() => userMenu()}>
                <span>Hello, {username}</span>
                <img
                  className="avatar"
                  src={require("../assets/default-avatar.png")}
                  alt="your avatar"
                />
              </span>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">
                <span className="login--btn">Log In</span>
              </Link>
              <Link to="/signup">
                <span className="signup--btn">Sign Up</span>
              </Link>
            </div>
          )}
          {user && showUserMenu && <UserMenu user={user} />}

        </div>
      </header>
    );
}