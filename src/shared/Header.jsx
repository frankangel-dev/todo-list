import Navigation from "./Navigation.jsx";
import Logoff from "../features/Logoff.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function Header() {
  const {isAuthenticated} = useAuth();
  const {theme, toggleTheme} = useTheme();

  return (
    <header
      className={'sticky top-0 z-40 flex w-full items-center gap-4 border-b border-border bg-glass px-5 py-3.5 backdrop-blur-md sm:px-8'}
      aria-label='Main navigation header'>
      <h1 className={'mr-auto font-heading text-lg text-text-primary sm:text-xl'}>To-do List</h1>
      <Navigation/>
      <div className={'flex items-center gap-2'}>
        <button
          className={'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ?
            <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
            :
            <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.9 4.9 1.4 1.4"/>
              <path d="m17.7 17.7 1.4 1.4"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.3 17.7-1.4 1.4"/>
              <path d="m19.1 4.9-1.4 1.4"/>
            </svg>
          }
        </button>
        {isAuthenticated &&
          <div className={'hidden md:block'}>
            <Logoff/>
          </div>
        }
      </div>
    </header>
  );
}
