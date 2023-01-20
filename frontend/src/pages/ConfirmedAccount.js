import React from 'react'
import { Link } from "react-router-dom";

export default function ConfirmedAccount() {
  const [token, setToken] = React.useState(null);
   React.useEffect(() => {
     const start = window.location.href.indexOf("=") + 1;
     setToken(window.location.href.slice(start));
     
   }, []);

   const verify = async () => {
    const response = await fetch(`api/users/${token}`);
    const json = await response.json(); 
    if(response.ok){
        console.log(json.success)
        return json
    } else {
        console.log(json.error)
    }
   }
   verify()
   
  return (
    <div className="confirmed--account">
      <h2>Your account has been confirmed.</h2>
      <p>
        You may <Link to="/login">Log in</Link> now.
      </p>
    </div>
  );
}
