import { memo, useEffect, useState } from "react";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";
import { UserMenu, UserSettings } from "../";
import { useSelector, useDispatch } from "react-redux";
import defaultAvatar from "../../assets/default-avatar.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { isUserMenuMounted, isUserSettingsFormMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const [username, setUsername] = useState("who are you?");
  const [profileImg, setProfileImg] = useState(defaultAvatar);

  const changeProfileImg = (img) => {
    if (Buffer.byteLength(img) > 1048576) return;
    return setProfileImg(img);
  };

  useEffect(() => {
    if (!user) return;
    const username = localStorage.getItem("username");
    if (username) {
      setUsername(username);
    } else {
      setUsername(user.username);
    }
    const newImg = localStorage.getItem("newImg");
    if (newImg) {
      setProfileImg(newImg);
    } else if (user.profileImg) {
      setProfileImg(user.profileImg);
    } else {
      return;
    }
  }, [user]);

  return (
    <header className={user ? "header--blur" : ""}>
      <div className="container">
        <h1 className={user ? "logged--in--logo" : "logo"}>
          <Link to="/">WorkoutMate</Link>
        </h1>
        {user && (
          <div>
            <button
              aria-label="open user menu"
              className="hello--user"
              onClick={() => dispatch({ type: "TOGGLE_MOUNT_USER_MENU" })}
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
          <div className="about--login--signup--nav">
            <Link to="/about" aria-label="about">
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
        {user && isUserMenuMounted && <UserMenu />}
        {isUserSettingsFormMounted && (
          <UserSettings changeProfileImg={changeProfileImg} />
        )}
      </div>
    </header>
  );
};

export default memo(Navbar);
