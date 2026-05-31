import {useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useLocation, useNavigate} from "react-router";

export default function RequireAuth({children}) {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated ) {
            navigate('/login', {state: {from: location}, replace: true});
        }
    }, [isAuthenticated, navigate, location]);
    return (
        <div>
            {isAuthenticated ? children : <p>Redirecting...</p>}
        </div>
    );
}