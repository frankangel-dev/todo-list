import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function LoginPage() {
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/todos';
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setIsLoggingOn(true);

        try {
            const result = await login(email, password);

            if (!result.success) {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }
    
    return (
        <>
            {authError && <p>{authError}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor={'email'}>Email</label>
                <input
                    type={"email"}
                    id={'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoggingOn}
                />

                <label htmlFor={'password'}>Password</label>
                <input
                    type={"password"}
                    id={'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoggingOn}
                />

                <button type={"submit"} disabled={isLoggingOn}>{isLoggingOn ? 'Logging in...' : 'Log On'}</button>
            </form>
        </>
    );
}