import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";
import {sanitizeInput} from "../utils/sanitize.js";
import {useGoogleLogin} from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const {login, googleLogin, isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  // the widget hands back a token when the box is ticked, and null when it expires
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  // the backend route finds or creates the account, so signing up and signing in with
  // Google are the same request.
  const googleSignIn = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      setRegisterError('');
      setIsRegistering(true);

      try {
        const result = await googleLogin(response.code);

        if (!result.success) {
          setRegisterError(result.error);
        }
      } catch (e) {
        setRegisterError(`Error: ${e.name} | ${e.message}`);
      } finally {
        setIsRegistering(false);
      }
    },
    onError: () => {
      setRegisterError('Google sign up was cancelled.');
    },
  });

  const passwordCheck = [
    {label: 'At least 8 characters', check: password.length >= 8},
    {label: 'One lowercase letter', check: /[a-z]/.test(password)},
    {label: 'One capital letter', check: /[A-Z]/.test(password)},
    {label: 'One number', check: /\d/.test(password)},
    {label: 'One symbol', check: /[^a-zA-Z0-9]/.test(password)},
  ]
  const validPassword = passwordCheck.every(password => password.check)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', {replace: true});
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!validPassword) {
      setRegisterError('Password does not meet all requirements.')
      return;
    }

    if (!recaptchaToken) {
      setRegisterError('Please check the box to prove you are not a robot.');
      return;
    }

    setIsRegistering(true);

    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          password: cleanPassword,
          recaptchaToken
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterError(`Registration failed: ${data?.message}`);
        // a token only works once, clears the box and makes them tick it again
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        return;
      }

      // log the new user straight in, then the effect above redirects to /todos
      const result = await login(cleanEmail, cleanPassword);

      if (!result.success) {
        setRegisterError(result.error);
      }
    } catch (error) {
      setRegisterError(`Error: ${error.name} | ${error.message}`);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <div className={'mx-auto grid w-full max-w-5xl items-center gap-10 px-5 py-10 sm:px-8 md:grid-cols-2 md:py-20'}>
      <div className={'flex flex-col gap-3.5'}>
                <span
                  className={'flex h-14 w-14 items-center justify-center rounded-full bg-accent-2 text-accent-text'}>
                    <svg className={'h-6 w-6'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
                         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14"/><path d="M12 5v14"/>
                    </svg>
                </span>
        <h2 className={'font-heading text-3xl text-text-primary sm:text-5xl'}>Create your account</h2>
        <p className={'max-w-sm text-base text-text-muted'}>Sign up with an email or just use your Google account.
          You will start off with a few tasks to try things out.</p>
      </div>

      <div className={'flex flex-col gap-4 rounded-card bg-surface p-6 shadow-md sm:p-8'}>
        {registerError &&
          <p className={'rounded-full bg-accent-soft px-4 py-3 text-sm font-medium text-error'}
             role={'alert'}>{registerError}</p>}
        <form onSubmit={handleSubmit} className={'flex w-full flex-col gap-4'}>
          <div className={'flex flex-col gap-1.5'}>
            <label htmlFor={'registerEmail'} className={'text-xs text-text-muted'}>Email</label>
            <div className={'relative flex items-center'}>
              <svg className={'pointer-events-none absolute left-4 h-4 w-4 text-text-muted'}
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                className={'min-h-12 w-full rounded-full border border-border bg-bg pl-11 pr-4 text-base text-text-primary outline-none placeholder:text-text-muted'}
                type={"email"}
                id={'registerEmail'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isRegistering}
                placeholder={'you@example.com'}
                maxLength={200}
                autoComplete={'email'}
              />
            </div>
          </div>

          <div className={'flex flex-col gap-1.5'}>
            <label htmlFor={'registerPassword'} className={'text-xs text-text-muted'}>Password</label>
            <div className={'relative flex items-center'}>
              <svg className={'pointer-events-none absolute left-4 h-4 w-4 text-text-muted'}
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                className={'min-h-12 w-full rounded-full border border-border bg-bg pl-11 pr-14 text-base text-text-primary outline-none placeholder:text-text-muted'}
                type={showPassword ? 'text' : 'password'}
                id={'registerPassword'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isRegistering}
                placeholder={'Password'}
                maxLength={200}
                autoComplete={'new-password'}
              />

              <button
                className={'absolute right-1.5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-muted'}
                type={'button'}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ?
                  <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path
                      d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  :
                  <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61"/>
                    <path d="m2 2 20 20"/>
                  </svg>
                }
              </button>
            </div>

            {password.length > 0 && (
              <ul className={'flex flex-col gap-1 text-sm'} aria-live={'polite'}>
                {passwordCheck.map(password => (
                  <li
                    key={password.label}
                    className={password.check ? 'text-success' : 'text-text-muted'}
                  >
                    <span aria-hidden={'true'}>{password.check ? '✓' : '○'}</span> {password.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={'flex justify-center'}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={setRecaptchaToken}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>

          <button
            className={'min-h-13 w-full cursor-pointer rounded-full border-none bg-accent p-3 text-base font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover active:bg-accent-active disabled:opacity-45'}
            type={"submit"}
            disabled={isRegistering || !recaptchaToken}
          >
            {isRegistering ? 'Creating account...' : 'Create account'}
          </button>

          {/* a divider between the buttons */}
          <div className={'flex items-center gap-3'}>
            <span className={'h-px flex-1 bg-border'}></span>
            <span className={'text-xs font-semibold uppercase tracking-wider text-text-muted'}>or</span>
            <span className={'h-px flex-1 bg-border'}></span>
          </div>

          <button
            className={'flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-border bg-bg p-3 text-base font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 disabled:opacity-45 dark:hover:bg-white/10'}
            type={"button"}
            onClick={() => googleSignIn()}
            disabled={isRegistering}
          >
            <svg className={'h-5 w-5'} viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4"
                    d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.57-5.17 3.57-8.87Z"/>
              <path fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96h-4v3.09A12 12 0 0 0 12 24Z"/>
              <path fill="#FBBC05"
                    d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62h-4a12 12 0 0 0 0 10.76l4-3.09Z"/>
              <path fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"/>
            </svg>
            Sign up with Google
          </button>
        </form>
        <p className={'text-sm text-text-muted'}>
          Already have an account? <Link to={'/login'} className={'font-semibold text-accent'}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
