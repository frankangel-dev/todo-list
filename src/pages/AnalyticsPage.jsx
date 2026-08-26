import {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import useDebounce from "../utils/useDebounce.js";

// admin only page that reads the three analytics routes
// nothing here writes anything
export default function AnalyticsPage() {
  const {token} = useAuth();
  const [view, setView] = useState('people');

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // filled in when you expand someone's row
  const [openUserId, setOpenUserId] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || view !== 'people') return;

    const fetchPeople = async () =>{
      try {
        const response = await fetch(`/api/analytics/users?page=${page}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          const error = new Error(response.status === 401 ? 'account is not an admin' : 'Failed to fetch people');
          error.status = response.status;
          throw error;
        }

        setUsers(data.users)
        setPagination(data.pagination)

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPeople();

  }, [token, view, page]);

  useEffect(() => {
    if (!token || openUserId === null) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/analytics/users/${openUserId}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        setBreakdown(data)

      } catch (error) {
        setError(error.message);
      }
    }

    fetchUser();

  }, [token, openUserId]);

  useEffect(() => {
    if (!token || view !== 'search') return;

    // the API 400s on anything shorter than 2 characters
    if (debouncedSearch.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`/api/analytics/tasks/search?q=${encodeURIComponent(debouncedSearch)}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        setSearchResults(data.results)

      } catch (error) {
        setError(error.message);
      }
    }

    fetchSearchResults();
    
  }, [token, view, debouncedSearch]);

  const doneCount = breakdown?.taskStats?.find(stat => stat.isCompleted)?._count?.id ?? 0;
  const openCount = breakdown?.taskStats?.find(stat => !stat.isCompleted)?._count?.id ?? 0;
  const totalCount = doneCount + openCount;

  return (
    <div className={'mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12'}>
      <div className={'flex flex-col gap-1'}>
        <h2 className={'font-heading text-3xl text-text-primary sm:text-4xl'}>Team analytics</h2>
        <p className={'text-body-sm text-text-muted'}>See what everyone is working on.</p>
      </div>

      {/* People / Search switch */}
      <div className={'flex min-h-11 self-start overflow-hidden rounded-full border border-border'}
           role={'group'} aria-label={'Analytics view'}>
        {[{value: 'people', label: 'People'}, {value: 'search', label: 'Search'}].map((option, index) => (
          <button
            key={option.value}
            className={`cursor-pointer px-6 text-sm transition-colors duration-150 ${index > 0 ? 'border-l border-border' : ''} ${view === option.value ? 'bg-accent font-semibold text-accent-text' : 'bg-transparent text-text-muted hover:bg-black/5 dark:hover:bg-white/10'}`}
            type={'button'}
            onClick={() => setView(option.value)}
            aria-pressed={view === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error &&
        <div className={'flex items-center justify-between gap-2 rounded-card bg-accent-soft p-4 text-error'}
             role={'alert'}>
          <p>{error}</p>
          <button className={'cursor-pointer border-none bg-transparent text-xs font-semibold underline'}
                  type={'button'} onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      }

      {view === 'people' ? (
        <div className={'flex flex-col gap-3.5'}>
          {isLoading && users.length === 0 &&
            <>
              <div className={'h-32 animate-pulse rounded-card bg-surface'}></div>
              <div className={'h-32 animate-pulse rounded-card bg-surface'}></div>
            </>
          }

          {!isLoading && users.length === 0 && !error &&
            <p className={'py-10 text-center text-body-sm text-text-muted'}>Nobody has signed up yet.</p>
          }

          {users.map(user => (
            <div key={user.id} className={'flex flex-col gap-3.5'}>
              <div className={'flex flex-col gap-3.5 rounded-card bg-surface p-5 shadow-sm'}>
                <div className={'flex items-start justify-between gap-4'}>
                  <div className={'flex flex-col gap-0.5'}>
                    <span className={'font-heading text-xl text-text-primary'}>{user.name}</span>
                    <span className={'text-meta text-text-muted'}>{user.email}</span>
                  </div>
                  <span className={'shrink-0 rounded-full bg-bg px-3 py-1 text-meta font-semibold text-text-muted'}>
                    {user._count?.Task ?? 0} tasks
                  </span>
                </div>

                {/* the API sends up to 5 open task ids per user, so only ids are shown */}
                {user.Task?.length > 0 &&
                  <div className={'flex flex-wrap gap-2'}>
                    {user.Task.map(task => (
                      <span key={task.id}
                            className={'rounded-full border border-border px-3 py-1 text-meta text-text-muted'}>
                        Task #{task.id}
                      </span>
                    ))}
                  </div>
                }

                <button
                  className={'flex min-h-10 cursor-pointer items-center gap-2 self-start rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
                  type={'button'}
                  onClick={() => {
                    // clicking the open one closes it
                    setBreakdown(null);
                    setOpenUserId(openUserId === user.id ? null : user.id);
                  }}
                  aria-expanded={openUserId === user.id}
                >
                  Breakdown
                  <svg className={`h-4 w-4 transition-transform duration-150 ${openUserId === user.id ? 'rotate-90' : ''}`}
                       viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>

              {openUserId === user.id && breakdown &&
                <div className={'flex flex-col gap-5 rounded-card bg-accent-soft p-5'}>
                  <div className={'flex gap-3'}>
                    {[
                      {label: 'Done', value: doneCount, accent: true},
                      {label: 'Open', value: openCount, accent: false},
                      {label: 'Total', value: totalCount, accent: false}
                    ].map(stat => (
                      <div key={stat.label}
                           className={`flex flex-1 flex-col gap-1 rounded-card p-4 ${stat.accent ? 'bg-accent-2-soft' : 'bg-surface'}`}>
                        <span className={'text-xs font-bold uppercase tracking-wider text-text-muted'}>{stat.label}</span>
                        <span className={`font-heading text-3xl ${stat.accent ? 'text-accent-2' : 'text-text-primary'}`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {breakdown.recentTasks?.length > 0 &&
                    <div className={'flex flex-col gap-2.5'}>
                      <span className={'text-xs font-bold uppercase tracking-wider text-text-muted'}>Most recent</span>
                      {breakdown.recentTasks.map(task => (
                        <div key={task.id}
                             className={'flex items-center gap-3 rounded-card bg-surface px-5 py-3.5'}>
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${task.isCompleted ? 'bg-accent-2' : 'bg-accent'}`}></span>
                          <span className={`flex-1 text-body ${task.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              }
            </div>
          ))}

          {pagination?.pages > 1 &&
            <div className={'flex items-center justify-between gap-4 pt-2'}>
              <button
                className={'min-h-10 cursor-pointer rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-45 dark:hover:bg-white/10'}
                type={'button'}
                onClick={() => setPage(current => current - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </button>
              <span className={'text-body-sm text-text-muted'}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className={'min-h-10 cursor-pointer rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-45 dark:hover:bg-white/10'}
                type={'button'}
                onClick={() => setPage(current => current + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          }
        </div>
      ) : (
        <div className={'flex flex-col gap-3.5'}>
          <div className={'relative flex items-center'}>
            <svg className={'pointer-events-none absolute left-4 h-4 w-4 text-text-muted'} viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"
                 aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <label htmlFor={'analyticsSearch'} className={'sr-only'}>Search tasks across accounts</label>
            <input
              className={'min-h-12 w-full rounded-full border border-border bg-surface pr-4 pl-11 text-body text-text-primary'}
              id={'analyticsSearch'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={'Search by task or person, at least 2 letters'}
            />
          </div>

          {searchResults.length === 0 && debouncedSearch.trim().length >= 2 &&
            <p className={'py-10 text-center text-body-sm text-text-muted'}>Nothing matched that search.</p>
          }

          {searchResults.map(result => (
            <div key={result.id}
                 className={'flex items-center gap-3 rounded-card bg-surface px-5 py-4 shadow-sm'}>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${result.isCompleted ? 'bg-accent-2' : 'bg-accent'}`}></span>
              <span className={`flex-1 text-body ${result.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                {result.title}
              </span>
              <span className={'shrink-0 rounded-full bg-bg px-3 py-1 text-meta font-semibold text-text-muted'}>
                {result.user_name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
