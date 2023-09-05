import React from "react";
import { useLogout } from "../hooks/useLogout";
import UserSettings from "./UserSettings";
import { useDispatch, useSelector } from "react-redux";

export default function UserMenu(props) {
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const { showUserSettingsForm } = useSelector(state => state.showComponent);

  return (
    <>
      <div aria-label="user menu" className="user--menu">
        <button
          aria-label="open user settings"
          className="user--menu--item"
          onClick={() => dispatch({type: "SHOW_USER_SETTINGS_FORM"})}
        >
          Settings
        </button>
        <button 
          aria-label="log out"
          className="user--menu--item" onClick={() => logout()}>
          Log Out
        </button>
      </div>

      {showUserSettingsForm && <UserSettings changeProfileImg={props.changeProfileImg} /> }
    </>
  );
}
