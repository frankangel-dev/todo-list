import {useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useLocation, useNavigate} from "react-router";

export default function RequireAuth({children}) {
    const {isAuthenticated, isLoggingOut} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            if (isLoggingOut.current) {
                isLoggingOut.current = false;
                navigate('/login', { state: { loggedOut: true }, replace: true });
            } else {
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
    }, [isAuthenticated, navigate, location, isLoggingOut]);
    return (
        <div>
            {isAuthenticated ? children : <p>Redirecting...</p>}
        </div>
    );
}