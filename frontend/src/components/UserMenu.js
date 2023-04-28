import React from "react";
import { useLogout } from "../hooks/useLogout";
import UserSettings from "./UserSettings";

export default function UserMenu(props) {
  const { logout } = useLogout();
  const [userSettings, setUserSettings] = React.useState(false);

  const closeUserSettings = () => {
    setUserSettings(false)
  }

  const closeAllAndLogout = () => {
    props.userMenu();
    logout()
  }

  return (
    <>
      <div aria-label="user menu" className="user--menu">
        <button
          aria-label="open user settings"
          className="user--menu--item"
          onClick={() => setUserSettings((prev) => !prev)}
        >
          Settings
        </button>
        <button 
          aria-label="log out"
          className="user--menu--item" onClick={closeAllAndLogout}>
          Log Out
        </button>
      </div>

      {userSettings && (
        <UserSettings
          closeUserSettings={closeUserSettings}
          changeProfileImg={props.changeProfileImg}
        />
      )}
    </>
  );
}
