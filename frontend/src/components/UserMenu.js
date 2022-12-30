import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { deleteAllWorkouts } from "../hooks/useDeleteAllWorkouts";
import UserSettings from "./UserSettings";

export default function UserMenu() {
  const { user } = useAuthContext();
  const { deleteUser } = useDeleteUser();
  const { deleteAll } = deleteAllWorkouts();
  const { logout } = useLogout();
  const [deleteAccountDialogue, setDeleteAccountDialogue] =
    React.useState(false);
  const [userSettings, setUserSettings] = React.useState(true);

  function logOut() {
    logout();
  }
  function showDeleteAccount() {
    setDeleteAccountDialogue((prev) => !prev);
  }

  const deleteAccount = async () => {
    await deleteAll();
    await deleteUser(user.id);
    logout();
  };

  function closeUserSettings(){
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
        <span className="user--menu--item" onClick={logOut}>
          Log Out
        </span>
        <span className="user--menu--item" onClick={showDeleteAccount}>
          delete account
        </span>
      </div>

      {userSettings && (
        <UserSettings
          closeUserSettings={closeUserSettings}
        />
      )}

      {deleteAccountDialogue && (
        <div className="delete--account--dialogue">
          This is irreversible.<br></br> We won't be able to recover any of your
          data.<br></br> Are you sure you want to proceed?
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
    </>
  );
}
