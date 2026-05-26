import {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function Logoff() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setError('');
        setIsLoggingOff(true);

        const result = await logout();

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
            setIsLoggingOff(false);
        }
    };
    
    return (
        <div>
            {error && <p>{error}</p>}
            <button 
                onClick={handleLogoff}
                disabled={isLoggingOff}
            >
                {isLoggingOff ? 'Logging off...' : 'Log Out'}
            </button>
        </div>
    );
}