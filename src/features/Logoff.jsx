import {useLogout} from "../hooks/useLogout.js";

export default function Logoff() {
    const {isLoggingOff, error, handleLogoff} = useLogout()
    
    return (
        <div className={'flex items-center gap-2'}>
            {error && <p className={'text-sm text-error'}>{error}</p>}
            <button
                className={'cursor-pointer rounded-full border-2 border-accent px-4 py-1.5 text-sm font-semibold transition-all duration-150 hover:bg-accent/50 hover:text-accent-text'}
                onClick={handleLogoff}
                disabled={isLoggingOff}
            >
                {isLoggingOff ? 'Logging off...' : 'Log Out'}
            </button>
        </div>
    );
}