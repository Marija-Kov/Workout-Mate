import { useEffect, useState } from "react";
import { useGetAccountConfirmationToken } from "../hooks/useGetAccountConfirmationToken";
import { useConfirmAccount } from "../hooks/useConfirmAccount";
import { useLogout } from "../hooks/useLogout";
import { Navigate } from "react-router-dom";

export default function ConfirmedAccount() {
  const { getAccountConfirmationToken } = useGetAccountConfirmationToken();
  const { confirmAccount } = useConfirmAccount();
  const { logout } = useLogout();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const confirmAndLogout = async () => {
      await confirmAccount(getAccountConfirmationToken());
      await logout();
    };

    confirmAndLogout();
    const delayRedirect = setTimeout(() => {
      setRedirect(true);
    }, 300)

    return () => clearTimeout(delayRedirect);

  }, []);

  return (
    <div className="confirmed--container">
      {redirect && <Navigate to="/login" />}
    </div>
  );
}
