import React from 'react'

export default function useResetPassword() {
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);

    const resetPassword = async (token, password, confirmPassword) => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/reset-password/${token}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            password: password,
            confirmPassword: confirmPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      } else if (response.ok) {
        setSuccess(json.success);
        setError(null);
      }
    };

  return { resetPassword, error, success };
}
