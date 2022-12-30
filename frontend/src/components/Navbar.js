import React from 'react';
import {Link} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Search from './Search';
import UserMenu from './UserMenu';

export default function Navbar({page, setPage}){
  const { user } = useAuthContext();
  const [showUserMenu, setShowUserMenu] = React.useState(true);
  const [username, setUsername] = React.useState('who are you?');
  const [profileImg, setProfileImg] = React.useState(
    require("../assets/default-avatar.png")
  );
  
   function userMenu(){
       setShowUserMenu(prev => !prev)
   }

React.useEffect(() => {
  if (user) {
    const i = user.email.indexOf("@");
    setUsername(`${user.email.slice(0, i)}`);
    const newImg = localStorage.getItem('newImg');
    user.profileImg && !newImg && setProfileImg(user.profileImg);
    newImg && setProfileImg(newImg)
  }  
}, []);

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
                <span className='avatar-wrapper'>
                <img
                  className="avatar"
                  src={profileImg}
                  alt="your avatar"
                />
                </span>
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
          {user && showUserMenu && 
           <UserMenu 
            user={user} 
            />}

        </div>
      </header>
    );
}