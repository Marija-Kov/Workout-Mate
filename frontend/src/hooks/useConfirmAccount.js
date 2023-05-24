import React from 'react'

export const useConfirmAccount = () => {
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);

  const confirmAccount = async (token) => {
   const response = await fetch(
     `${process.env.REACT_APP_API}/api/users/${token}`
   );
   const json = await response.json();
   if (response.ok) {
     setSuccess(json.success);
   } else {
     setError(json.error);
   }
  }

  return { confirmAccount, error, success }
}
