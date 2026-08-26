import {useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useLocation, useNavigate} from "react-router";

export default function RequireAuth({children}) {
  const {isAuthenticated, wasLoggingOutIntentional} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) return;

    // if the user intentionally logs out, don't send them back to the page they were on
    // if they get redirected by trying to visit a protected page, remember where they were going
    navigate('/login', {
      state: wasLoggingOutIntentional() ? {loggedOut: true} : {from: location},
      replace: true
    });
  }, [isAuthenticated, navigate, location, wasLoggingOutIntentional]);

  return isAuthenticated ? children : null;
}