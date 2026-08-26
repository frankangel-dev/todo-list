import {NavLink} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function BottomNav() {
  // log out lives on the Profile page on mobile
  const {isAuthenticated, isAdmin} = useAuth();

  const navLinkStyles = ({isActive}) => {
    return `${isActive ? 'bg-accent text-accent-text font-semibold' : 'text-text-muted'} flex min-w-14 min-h-12 flex-col items-center justify-center gap-0.5 rounded-full px-2.5 text-tiny whitespace-nowrap transition-colors duration-150`;
  };

  return (
    <nav
      className={'fixed right-4 bottom-4 left-4 z-50 flex items-center justify-around rounded-full bg-surface p-2 shadow-lg md:hidden'}
      aria-label={'Mobile navigation'}>
      <NavLink to={'/about'} className={navLinkStyles} aria-label='Go to about'>
        <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <span>About</span>
      </NavLink>

      {isAuthenticated &&
        <NavLink to={'/todos'} className={navLinkStyles} aria-label='Go to todos'>
          <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 5h8"/>
            <path d="M13 12h8"/>
            <path d="M13 19h8"/>
            <path d="m3 17 2 2 4-4"/>
            <rect x="3" y="4" width="6" height="6" rx="1"/>
          </svg>
          <span>To-dos</span>
        </NavLink>
      }

      {/* a fourth slot only admins can see, the bar stays at three for everyone else */}
      {isAdmin &&
        <NavLink to={'/analytics'} className={navLinkStyles} aria-label='Go to analytics'>
          <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
            <path d="M7 16v-4"/>
            <path d="M12 16v-8"/>
            <path d="M17 16v-6"/>
          </svg>
          <span>Analytics</span>
        </NavLink>
      }

      {isAuthenticated &&
        <NavLink to={'/profile'} className={navLinkStyles} aria-label='Go to profile'>
          <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="10" r="3"/>
            <path d="M7 20.7V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.7"/>
          </svg>
          <span>Profile</span>
        </NavLink>
      }

      {!isAuthenticated &&
        <NavLink to={'/login'} className={navLinkStyles} aria-label='Go to login'>
          <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <path d="m10 17 5-5-5-5"/>
            <path d="M15 12H3"/>
          </svg>
          <span>Login</span>
        </NavLink>
      }

      {!isAuthenticated &&
        <NavLink to={'/register'} className={navLinkStyles} aria-label='Go to register'>
          <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          <span>Register</span>
        </NavLink>
      }
    </nav>
  );
}
