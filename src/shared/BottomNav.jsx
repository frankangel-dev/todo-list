import {NavLink} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function BottomNav() {
    const {isAuthenticated, logout} = useAuth();
    
    const navLinkStyles = ({isActive}) => {
        return `${isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'} flex flex-col items-center gap-1 min-w-11 min-h-11 justify-center px-3 py-2 rounded-xl transition-all duration-150`;
    };
    
    return (
        <nav className={'bg-glass/80 fixed right-0 bottom-0 left-0 z-50 border-t border-border backdrop-blur-md md:hidden'} aria-label={'Mobile navigation'} >
            <div className={'mx-auto flex max-w-lg items-center justify-around px-4 py-2'}>
                <NavLink to={'/about'} className={navLinkStyles} aria-label='Go to about'
                >
                    <svg className={'h-6 w-6'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-Hidden="true" data-slot="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                    </svg>
                    <span>About</span>
                </NavLink>
                
                {isAuthenticated &&
                    <NavLink to={'/todos'} className={navLinkStyles} aria-label='Go to todos'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-Hidden="true"
                             className="lucide lucide-list-todo">
                            <path d="M13 5h8"></path>
                            <path d="M13 12h8"></path>
                            <path d="M13 19h8"></path>
                            <path d="m3 17 2 2 4-4"></path>
                            <rect x="3" y="4" width="6" height="6" rx="1"></rect>
                        </svg>
                        <span>Todos</span>
                    </NavLink>}
                
                {isAuthenticated &&
                    <NavLink to={'/profile'} className={navLinkStyles} aria-label='Go to profile'
                    >
                        <svg className={'h-6 w-6'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" aria-Hidden="true" data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>
                        <span>Profile</span>
                    </NavLink>}
                
                {!isAuthenticated &&
                    <NavLink to={'/login'} className={navLinkStyles} aria-label='Go to login'
                    >
                        <svg className={'h-6 w-6'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-Hidden="true" data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"/>
                        </svg>
                        <span>Login</span>
                    </NavLink>}
                
                {isAuthenticated &&
                    <button
                        className={'flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-error transition-all duration-150'}
                        onClick={() => logout()}
                    >
                        <svg className={'h-6 w-6'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                        </svg>

                        <span>Logout</span>
                    </button>
                }
            </div>
        </nav>
    );
}