import React from 'react'
import { Link } from "react-router-dom";

export default function ConfirmedAccount() {
  const [token, setToken] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);
   React.useEffect(() => {
     const start = window.location.href.indexOf("=") + 1;
     setToken(window.location.href.slice(start))  
   }, []);

   const verify = React.useCallback( async () => {
        const response = await fetch(`api/users/${token}`);
        const json = await response.json();
        if (response.ok) {
          setSuccess(json.success)
        } else {
          setError(json.error)
        }
      }, [token])

   React.useEffect(()=>{
  if(token){
    verify()
    }
   }, [token, verify])
    
  return (
    <>
      {success && (
        <div className="confirmed--account">
          <h2>Your account has been confirmed.</h2>
          <p>
            You may <Link to="/login">Log in</Link> now.
          </p>
        </div>
      )}
      {error && (
        <>
          <div className="error">{error} </div>
          <div className="already--confirmed">
            In fact, you might be seeing this because the page was refreshed
            after your account has already been confirmed!<br></br>
            Please try logging in.<br></br>
            <br></br>
            <Link to="/login">Log in</Link>
          </div>
        </>
      )}
    </>
  );
}
