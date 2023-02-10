import React from "react";
import { useLogout } from "../hooks/useLogout";


import UserSettings from "./UserSettings";

export default function UserMenu(props) {
  const { logout } = useLogout();
  const [userSettings, setUserSettings] = React.useState(false);

  const closeUserSettings = () => {
    setUserSettings(false)
  }

  return (
    <>
      <div className="user--menu">
        <span
          className="user--menu--item"
          onClick={() => setUserSettings((prev) => !prev)}
        >
          Settings
        </span>
        <span className="user--menu--item" onClick={logout}>
          Log Out
        </span>
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
