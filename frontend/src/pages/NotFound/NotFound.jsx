import { useEffect, useState } from "react";
import patternBkg from "../../assets/gym-pattern.png";
import { Navigate } from "react-router-dom";

const NotFound = () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const delayRedirect = setTimeout(() => {
      setRedirect(true);
    }, 3000);
    return () => clearTimeout(delayRedirect);
  });
  return (
    <div style={{ marginTop: 100, marginLeft: 100 }}>
      <h1>Page Not Found</h1>
      <h2>redirecting...</h2>
      <img
        className="about--gym--pattern--bkg"
        src={patternBkg}
        alt="Sports and healthy lifestyle symbols pattern"
      />
      {redirect && <Navigate to="/" />}
    </div>
  );
};

export default NotFound;
