import {useAuth} from "../contexts/AuthContext.jsx";
import {useLogout} from "../hooks/useLogout.js";
import {useEffect, useState} from "react";

export default function ProfilePage() {
  const {email, token} = useAuth();
  const [todoStates, setTodoStates] = useState({total: 0, completed: 0, active: 0});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const {isLoggingOff, error: logoutError, handleLogoff} = useLogout();

  useEffect(() => {
    async function fetchTodoStats() {
      setError('');

      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const error = new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch todos');
          error.status = response.status;
          throw error;
        }

        const todos = await response.json();

        const total = todos.tasks.length;
        const completed = todos.tasks.filter(todo => todo.isCompleted).length;
        const active = total - completed;

        setTodoStates({total, completed, active});

      } catch (error) {
        setError(`Error loading statistics: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className={'mx-auto flex max-w-3xl flex-col gap-6 px-5 py-8 sm:px-8'} aria-busy={'true'}>
        <p className={'sr-only'} role={'status'}>Loading your profile</p>
        <div className={'h-16 w-64 animate-pulse rounded-full bg-surface'}></div>
        <div className={'grid grid-cols-1 gap-4 sm:grid-cols-3'}>
          <div className={'h-28 animate-pulse rounded-card bg-surface'}></div>
          <div className={'h-28 animate-pulse rounded-card bg-surface'}></div>
          <div className={'h-28 animate-pulse rounded-card bg-surface'}></div>
        </div>
        <div className={'h-3 w-full animate-pulse rounded-full bg-surface'}></div>
      </div>
    );
  }

  return (
    <div className={'mx-auto flex max-w-3xl flex-col gap-7 px-5 py-8 sm:px-8'}>
      <div className={'flex items-center gap-4'}>
            <span
              className={'flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-2 font-heading text-2xl text-accent-text'}>
                {email.charAt(0).toUpperCase()}
            </span>
        <div className={'flex min-w-0 flex-col'}>
          <h2 className={'font-heading text-3xl text-text-primary'}>{email.split('@')[0]}</h2>
          <p className={'wrap-break-word text-body-sm text-text-muted'}>{email}</p>
        </div>
      </div>

      {error &&
        <p className={'rounded-card bg-accent-soft p-4 text-error'} role={'alert'}>{error}</p>
      }

      <div className={'grid grid-cols-1 gap-4 sm:grid-cols-3'}>
        <div className={'flex flex-col items-center gap-1 rounded-card bg-surface p-6 text-center shadow-sm'}>
          <p className={'text-xs uppercase tracking-wider text-text-muted'}>Total</p>
          <p className={'font-heading text-4xl text-text-primary'}>{todoStates.total}</p>
        </div>
        <div className={'flex flex-col items-center gap-1 rounded-card bg-surface p-6 text-center shadow-sm'}>
          <p className={'text-xs uppercase tracking-wider text-text-muted'}>Completed</p>
          <p className={'font-heading text-4xl text-accent-2'}>{todoStates.completed}</p>
        </div>
        <div className={'flex flex-col items-center gap-1 rounded-card bg-surface p-6 text-center shadow-sm'}>
          <p className={'text-xs uppercase tracking-wider text-text-muted'}>Active</p>
          <p className={'font-heading text-4xl text-accent'}>{todoStates.active}</p>
        </div>
      </div>

      {todoStates.total > 0 &&
        <div className={'flex flex-col gap-2.5'}>
          <div className={'flex justify-between text-body-sm text-text-muted'}>
            <p>Completion progress</p>
            <p>{Math.round((todoStates.completed / todoStates.total) * 100)}%</p>
          </div>
          <div className={'h-3 overflow-hidden rounded-full bg-track ring-1 ring-inset ring-border/50'}>
            <div className={'h-full rounded-full bg-accent-2 transition-all duration-500'}
                 style={{width: `${Math.round((todoStates.completed / todoStates.total) * 100)}%`}}
                 role={'progressbar'}
                 aria-label={'Completion progress'}
                 aria-valuenow={Math.round((todoStates.completed / todoStates.total) * 100)}
                 aria-valuemin={0}
                 aria-valuemax={100}
            >
            </div>
          </div>
        </div>
      }

      {/* mobile only, logout button moved to profile page */}
      <div className={'flex flex-col gap-4 border-t border-border pt-6 md:hidden'}>
        <div className={'flex flex-col'}>
          <p className={'wrap-break-word text-body-sm font-semibold text-text-primary'}>Signed in as {email}</p>
          <p className={'text-meta text-text-muted'}>Logging out clears this device only.</p>
        </div>
        <div className={'flex items-center gap-3'}>
          {logoutError && <p className={'text-sm text-error'}>{logoutError}</p>}
          <button
            className={'flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 disabled:opacity-45 dark:hover:bg-white/10'}
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
      </div>
    </div>
  );
}