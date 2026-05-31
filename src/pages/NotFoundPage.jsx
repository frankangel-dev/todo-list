import {Link} from "react-router";

export default function NotFoundPage() {
    return (
        <div>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <ul style={{listStyle: 'none', display: 'flex', gap: '1rem', padding: 0}}>
                <li><Link to={'/'}>Home</Link></li>
                <li><Link to={'/about'}>About</Link></li>
            </ul>
        </div>
    );
}