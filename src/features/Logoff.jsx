import {useLogout} from "../hooks/useLogout.js";

export default function Logoff() {
  const {isLoggingOff, error, handleLogoff} = useLogout()

  return (
    <div className={'flex items-center gap-2'}>
      {error && <p className={'text-sm text-error'}>{error}</p>}
      <button
        className={'flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
        onClick={handleLogoff}
        disabled={isLoggingOff}
      >
        <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <path d="m16 17 5-5-5-5"/>
          <path d="M21 12H9"/>
        </svg>
        {isLoggingOff ? 'Logging off...' : 'Log out'}
      </button>
    </div>
  );
}
