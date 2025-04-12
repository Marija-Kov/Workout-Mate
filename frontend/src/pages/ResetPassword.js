import React from "react";
import { Navigate } from "react-router-dom";
import useResetPassword from "../hooks/useResetPassword";
import { useGetTokenFromUrl } from "../hooks/useGetTokenFromUrl";
import { useSelector } from "react-redux";

export default function ResetPassword() {
  const { success } = useSelector((state) => state.flashMessages);
  const { resetPassword } = useResetPassword();
  const password = React.useRef();
  const confirmPassword = React.useRef();
  const token = useGetTokenFromUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(
      token,
      password.current.value,
      confirmPassword.current.value
    );
  };

  return (
    <div className="form--container--reset--password">
      <form className="reset--password" onSubmit={handleSubmit}>
        <label htmlFor="new-password">New password:</label>
        <input
          type="password"
          id="new-password"
          placeholder="new password"
          ref={password}
        />
        <label htmlFor="confirm-new-password">Confirm new password:</label>
        <input
          type="password"
          id="confirm-new-password"
          placeholder="confirm new password"
          ref={confirmPassword}
        />
        <button>Save</button>
        {success && <Navigate to="/login" />}
      </form>
    </div>
  );
}
