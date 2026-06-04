import {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export function useLogout() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setError('');
        setIsLoggingOff(true);

        const result = await logout();

        if (result.success) {
            setIsLoggingOff(false);
            navigate('/login');
        } else {
            setError(result.error);
            setIsLoggingOff(false);
        }
    };

    return {
        isLoggingOff,
        error,
        handleLogoff
    };
}