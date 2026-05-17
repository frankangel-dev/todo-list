import {useState} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function Logon() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    const {login} = useAuth();
    
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