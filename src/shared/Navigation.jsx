import {NavLink} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function Navigation() {
  const {isAuthenticated, isAdmin} = useAuth();

  const navLinkStyles = ({isActive}) => {
    return isActive
      ? 'font-semibold text-accent border-b-2 border-accent pb-0.5'
      : 'font-medium text-text-muted border-b-2 border-transparent pb-0.5 hover:text-accent transition-colors duration-150';
  };

  return (
    <nav aria-label='Primary navigation'>
      <ul className={'hidden list-none items-center gap-7 text-body-sm md:flex'}>
        <li><NavLink to={'/about'} className={navLinkStyles}>About</NavLink></li>
        {isAuthenticated && <li><NavLink to={'/todos'} className={navLinkStyles}>To-dos</NavLink></li>}
        {isAdmin && <li><NavLink to={'/analytics'} className={navLinkStyles}>Analytics</NavLink></li>}
        {isAuthenticated && <li><NavLink to={'/profile'} className={navLinkStyles}>Profile</NavLink></li>}
        {!isAuthenticated && <li><NavLink to={'/login'} className={navLinkStyles}>Login</NavLink></li>}
        {!isAuthenticated && <li><NavLink to={'/register'} className={navLinkStyles}>Register</NavLink></li>}
      </ul>
    </nav>
  );
}
