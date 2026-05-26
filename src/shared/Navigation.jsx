import {NavLink} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function Navigation() {
    const {isAuthenticated} = useAuth();

    const navLinkStyles = ({isActive}) => {
        return isActive ? {fontWeight: 'bold', textDecoration: 'underline'} : {fontWeight: 'normal', textDecoration: 'none'};
    };
    return (
        <nav>
            <ul style={{listStyle: 'none', display: 'flex', gap: '1rem', padding: 0}}>
                <li><NavLink to={'/about'} style={navLinkStyles}>About</NavLink></li>
                {isAuthenticated && <li><NavLink to={'/todos'} style={navLinkStyles}>Todos</NavLink></li>}
                {isAuthenticated && <li><NavLink to={'/profile'} style={navLinkStyles}>Profile</NavLink></li>}
                {!isAuthenticated && <li><NavLink to={'/login'} style={navLinkStyles}>Login</NavLink></li>}
            </ul>
        </nav>
    );
}