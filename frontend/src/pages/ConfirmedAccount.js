import React from 'react'
import useConfirmAccount from '../hooks/useConfirmAccount';

export default function ConfirmedAccount() {
  const [token, setToken] = React.useState(null);
  const { confirmAccount, error, success } = useConfirmAccount();
   React.useEffect(() => {
     const start = window.location.href.indexOf("=") + 1;
     setToken(window.location.href.slice(start))  
   }, []);

   const verify = React.useCallback( async () => {
        await confirmAccount(token)
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
