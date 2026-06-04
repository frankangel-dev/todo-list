import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";
import {sanitizeInput} from "../utils/sanitize.js";

export default function LoginPage() {
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // if RequireAuth redirects the user here, send them back where they were trying to go after login
    // if they logged out intentionally, location.state.loggedOut is true, so it defaults to /todos
    const from = location.state?.loggedOut ? '/todos' : (location.state?.from?.pathname || '/todos');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            const result = await login(sanitizeInput(email), sanitizeInput(password));

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
        <div className={'fixed inset-0 flex items-center justify-center px-4 sm:px-6'}>
            <div className={'bg-glass flex w-full max-w-md flex-col gap-1 rounded-3xl border border-border p-6 shadow-2xl backdrop-blur-md sm:p-10'}>
                <h2 className={'mb-4 flex justify-center text-center text-2xl font-bold text-text-primary'}>Sign in to your account</h2>
                {authError &&
                    <p className={'w-full max-w-96 rounded-lg bg-error/10 px-4 py-3 text-sm font-medium text-error'} role={'alert'}>{authError}</p>}
                <form onSubmit={handleSubmit} className={'flex w-full max-w-sm flex-col gap-4'}>
                    <div className={'flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3'}>
                        <svg className={'w-5 text-text-muted'} xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"
                             data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                        </svg>
                        <label htmlFor={'email'} className={'sr-only'}>Email</label>
                        <input
                            className={'min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-muted'}
                            type={"email"}
                            id={'email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoggingOn}
                            placeholder={'Email'}
                            maxLength={200}
                            autoComplete={'email'}
                        />
                    </div>
                    <div className={'flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3'}>
                        <svg className={'h-5 w-5 shrink-0 text-text-muted'} xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"
                             data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                        </svg>
                        <label htmlFor={'password'} className={'sr-only'}>Password</label>
                        <input
                            className={'min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-muted'}
                            type={showPassword ? 'text' : 'password'}
                            id={'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoggingOn}
                            placeholder={'Password'}
                            maxLength={200}
                            autoComplete={'current-password'}
                        />
                        <button
                            className={'shrink-0 cursor-pointer border-none bg-transparent text-text-muted'}
                            type={'button'}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                        >
                            {showPassword ?
                                <svg className={'h-5 w-5'} xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                     aria-hidden="true" data-slot="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                                :
                                <svg className={'h-5 w-5'} xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                     aria-hidden="true" data-slot="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                </svg>
                            }
                        </button>
                    </div>
                    <button
                        className={'w-full cursor-pointer rounded-full bg-accent p-3 text-base font-bold text-accent-text transition-opacity duration-150 hover:opacity-80 disabled:opacity-50'}
                        type={"submit"}
                        disabled={isLoggingOn}
                    >
                        {isLoggingOn ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}