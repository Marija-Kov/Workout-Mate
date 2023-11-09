import { useEffect } from "react";
import { useGetAccountConfirmationToken } from "../hooks/useGetAccountConfirmationToken";
import { useConfirmAccount } from "../hooks/useConfirmAccount";
import { useLogout } from "../hooks/useLogout";
import { useSelector } from "react-redux";

export default function ConfirmedAccount() {
  const { confirmAccountError, success } = useSelector((state) => state.user);
  const { getAccountConfirmationToken } = useGetAccountConfirmationToken();
  const { confirmAccount } = useConfirmAccount();
  const { logout } = useLogout();

  useEffect(() => {
    logout();
    confirmAccount(getAccountConfirmationToken());
  }, []);

  return (
    <div className="confirmed--container">
      {success ? (
        <div role="alert" className="confirmed--account--success">
          <h2>Account confirmed</h2>
          <p>{success}</p>
        </div>
      ) : (
        <div role="alert" className="error">
          {confirmAccountError}{" "}
        </div>
      )}
    </div>
  );
}
