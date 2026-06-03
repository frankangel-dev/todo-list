import {NavLink} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function Navigation() {
    const {isAuthenticated} = useAuth();

    const navLinkStyles = ({isActive}) => {
        return isActive ? 'font-bold text-accent border-b-2 border-accent pb-0.5' : 'font-medium text-text-muted border-b-2 border-transparent pb-0.5 hover:text-accent transition-colors duration-150';
    };
    return (
        <nav aria-label='Primary navigation'>
            <ul className={'hidden list-none text-xl items-center gap-10 md:flex'}>
                <li><NavLink to={'/about'} className={navLinkStyles}>About</NavLink></li>
                {isAuthenticated && <li><NavLink to={'/todos'} className={navLinkStyles}>Todos</NavLink></li>}
                {isAuthenticated && <li><NavLink to={'/profile'} className={navLinkStyles}>Profile</NavLink></li>}
                {!isAuthenticated && <li><NavLink to={'/login'} className={navLinkStyles}>Login</NavLink></li>}
            </ul>
        </nav>
    );
}