import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logOutIfTokenExpired } from "../utils/logOutIfTokenExpired";
import UserMenu from "./UserMenu";
import UserSettings from "./UserSettings";
import { useSelector, useDispatch } from "react-redux";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { showUserMenu, showUserSettingsForm } = useSelector(
    (state) => state.showComponent
  );
  const [username, setUsername] = useState("who are you?");
  const [profileImg, setProfileImg] = useState(
    require("../assets/default-avatar.png")
  );

  const changeProfileImg = (img) => {
    setProfileImg(img);
  };

  useEffect(() => {
    if (user) {
      const username = localStorage.getItem("username");
      if (!user.username && !username) {
        const i = user.email.indexOf("@");
        setUsername(`${user.email.slice(0, i)}`);
      } else {
        if (username) setUsername(username);
        if (user.username && !username) setUsername(user.username);
      }
      const newImg = localStorage.getItem("newImg");
      if (user.profileImg && !newImg) setProfileImg(user.profileImg);
      if (newImg) setProfileImg(newImg);
    }
  }, [user]);

  return (
    <header
      data-testid="navbar"
      className={user ? "header--blur" : ""}
      onClick={user && logOutIfTokenExpired}
    >
      <div className="container">
        <h1 className={user ? "logged--in--logo" : "logo"}>
          <Link to="/">WorkoutMate</Link>
        </h1>
        {user && (
          <div>
            <button
              aria-label="open user menu"
              className="hello--user"
              onClick={() => dispatch({ type: "SHOW_USER_MENU" })}
            >
              <span>
                Hello, <strong>{username}</strong>
              </span>
              <span className="avatar-wrapper">
                <img className="avatar" src={profileImg} alt="your avatar" />
              </span>
            </button>
          </div>
        )}
        {!user && (
          <div
            className="about--login--signup--nav"
            onClick={() =>
              dispatch({ type: "RESET_USER_STATE" })
            }
          >
            <Link to="/about" aria-label="about workout mate">
              <span className="about--btn">About</span>
            </Link>
            <Link to="/login" aria-label="go to login page">
              <span className="login--btn">Log In</span>
            </Link>
            <Link to="/signup" aria-label="go to signup page">
              <span className="signup--btn">Sign Up</span>
            </Link>
          </div>
        )}
        {user && showUserMenu && <UserMenu />}
        {showUserSettingsForm && (
          <UserSettings changeProfileImg={changeProfileImg} />
        )}
      </div>
    </header>
  );
}
