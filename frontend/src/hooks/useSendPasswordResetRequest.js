import React from 'react'

export default function useSendPasswordResetRequest() {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const sendPasswordResetRequest = async (email) => {
    if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
      setError("Please enter a valid email address")
      return
    }
    const response = await fetch(`${process.env.REACT_APP_API}/api/reset-password`, {
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
