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
  const [dropdown, setDropdown] = React.useState(false);
  const [username, setUsername] = React.useState('who are you?')
  const [deleteAccountDialogue, setDeleteAccountDialogue] = React.useState(false);
  const { logout } = useLogout();

   function setDrop(){
       setDropdown(prev => !prev)
   }
   function logOut() {
      logout()
   }
   function showDeleteAccount(){
     setDeleteAccountDialogue(prev => !prev)
   }

const deleteAccount = async () => {
  await deleteAll()
  await deleteUser(user.id)
  logout()
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
              <span className="hello--user" onClick={() => setDrop()}>
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
          {user && dropdown && (
            <div className="user--dropdown">
              <span className="user--dropdown--item">Settings</span>
              <span className="user--dropdown--item" onClick={logOut}>
                Log Out
              </span>
              <span
                className="user--dropdown--item"
                onClick={showDeleteAccount}
              >
                delete account
              </span>
            </div>
          )}
          {user && deleteAccountDialogue && (
            <div className="delete--account--dialogue">
              This is irreversible.<br></br> We won't be able to recover any of
              your data.<br></br> Are you sure you want to proceed?
              <div>
                <button type="button" onClick={deleteAccount}>
                  Yes, delete my account permanently.
                </button>
                <button type="button" onClick={showDeleteAccount}>
                  No, I changed my mind.
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    );
}