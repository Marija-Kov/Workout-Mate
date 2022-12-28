import React from "react";
import { useLogout } from "../hooks/useLogout";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { deleteAllWorkouts } from "../hooks/useDeleteAllWorkouts";

export default function UserMenu({ user }) {
  const { deleteUser } = useDeleteUser();
  const { deleteAll } = deleteAllWorkouts();
  const { logout } = useLogout();
  const [deleteAccountDialogue, setDeleteAccountDialogue] =
    React.useState(false);

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

  return (
    <>
      <div className="user--menu">
        <span className="user--menu--item">Account settings</span>
        <span className="user--menu--item" onClick={logOut}>
          Log Out
        </span>
        <span className="user--menu--item" onClick={showDeleteAccount}>
          delete account
        </span>
      </div>
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
