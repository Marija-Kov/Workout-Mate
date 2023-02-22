import React from 'react'

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
    <div className="confirmed--container">
      {success && (
        <div className="confirmed--account--success">
          <h2>Your account has been confirmed.</h2>
          <p>You may log in now.</p>
        </div>
      )}
      {error && (
        <>
          <div className="error">{error} </div>
          <div className="already--confirmed">
            <p>In fact, you might be seeing this because the page was refreshed
            after your account has already been confirmed!</p>
           <p> Please try logging in.</p>
          </div>
        </>
      )}
    </div>
  );
}
