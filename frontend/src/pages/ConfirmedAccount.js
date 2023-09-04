import { useEffect } from 'react'
import { useConfirmAccount } from '../hooks/useConfirmAccount';
import { useLogout } from '../hooks/useLogout';
import { useSelector } from 'react-redux';

export default function ConfirmedAccount() {
  const { confirmAccountError, success } = useSelector(state => state.user);
  const { confirmAccount } = useConfirmAccount();
  const { logout } = useLogout();
   
   useEffect(() => {
     logout();
     const start = window.location.href.indexOf("=") + 1;
     const token = window.location.href.slice(start) 
     confirmAccount(token)
     // TODO : Figure out a different(better), testable way to get the token!
   }, []);
    
  return (
    <div className="confirmed--container">
      {success ? 
        <div role="alert" className="confirmed--account--success">
          <h2>Account confirmed</h2>
          <p>{success}</p>
        </div> : 
        <div role="alert" className="error">{confirmAccountError} </div>
       }
    </div>
  );
}
