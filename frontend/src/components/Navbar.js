import React from 'react';
import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { deleteAllWorkouts } from "../hooks/useDeleteAllWorkouts";
import { useAuthContext } from '../hooks/useAuthContext';
import Search from './Search';

export default function Navbar({page, setPage}){
  const { user } = useAuthContext();
  const { deleteUser } = useDeleteUser();
  const { deleteAll } = deleteAllWorkouts();
  const [dropdown, setDropdown] = React.useState(true);
  const { logout } = useLogout();

   function setDrop(){
       setDropdown(prev => !prev)
   }
   const handleClick = () => {
      logout()
   }

const deleteAccount = async () => {
  await deleteAll()
  await deleteUser(user.id)
  logout()
}

    return (
      <header className={user ? "header--blur" : ""}>
        <div className="container">
          <h1>
            <Link to="/">WorkoutMate</Link>
          </h1>
          {user && <Search page={page} setPage={setPage} />}
          {user && (
            <div>
              <span className="hello--user" onClick={() => setDrop()}>
                <span>Hello, {user.username}</span>
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
          {user && dropdown && (
            <div className="user--dropdown">
              <span className="user--dropdown--item" onClick={handleClick}>
                Profile
              </span>
              <span className="user--dropdown--item" onClick={handleClick}>
                Log Out
              </span>
              <span className="user--dropdown--item" onClick={deleteAccount}>
                delete account
              </span>
            </div>
          )}
        </div>
      </header>
    );
}