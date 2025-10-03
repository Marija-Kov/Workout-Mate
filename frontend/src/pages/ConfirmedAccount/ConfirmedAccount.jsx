import { useEffect, useState } from "react";
import { useGetTokenFromUrl, useConfirmAccount, useLogout } from "../../hooks";
import { Navigate } from "react-router-dom";

const ConfirmedAccount = () => {
  const token = useGetTokenFromUrl();
  const { confirmAccount } = useConfirmAccount();
  const { logout } = useLogout();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const confirmAndLogout = async () => {
      await confirmAccount(token);
      await logout();
    };

    confirmAndLogout();
    const delayRedirect = setTimeout(() => {
      setRedirect(true);
    }, 300);

    return () => clearTimeout(delayRedirect);
  }, [confirmAccount, logout, token]);

  return (
    <div className="confirmed--container">
      {redirect && <Navigate to="/login" />}
    </div>
  );
};

export default ConfirmedAccount;
