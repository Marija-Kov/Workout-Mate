import React from 'react'

export default function useSendPasswordResetRequest() {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const sendPasswordResetRequest = async (email) => {
    const response = await fetch(`api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setSuccess(json.success);
      setError(null);
    }
  };

  return { sendPasswordResetRequest, error, success };
}
