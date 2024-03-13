import { useEffect } from "react";
import { useGetAccountConfirmationToken } from "../hooks/useGetAccountConfirmationToken";
import { useConfirmAccount } from "../hooks/useConfirmAccount";
import { useLogout } from "../hooks/useLogout";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ConfirmedAccount() {
  const { getAccountConfirmationToken } = useGetAccountConfirmationToken();
  const { confirmAccount } = useConfirmAccount();
  const { logout } = useLogout();
  const { success } = useSelector((state) => state.flashMessages);

  useEffect(() => {
    const logoutAndConfirm = async () => {
      await logout();
      confirmAccount(getAccountConfirmationToken());
    };
  
    logoutAndConfirm();
  }, []);

  return (
    <div className="confirmed--container">
     {success && <Navigate to="/login" />}
    </div>
  );
}
