import React from "react";
import { useLogout } from "../hooks/useLogout";
import { useDispatch } from "react-redux";

export default function UserMenu() {
  const dispatch = useDispatch();
  const { logout } = useLogout();

  return (
    <div className="user--menu">
      <button
        className="user--menu--item"
        onClick={() => dispatch({ type: "TOGGLE_MOUNT_USER_SETTINGS_FORM" })}
      >
        Settings
      </button>
      <button className="user--menu--item" onClick={logout}>
        Log Out
      </button>
    </div>
  );
}
