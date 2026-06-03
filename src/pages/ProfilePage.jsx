import {useAuth} from "../contexts/AuthContext.jsx";
import {useEffect, useState} from "react";

export default function ProfilePage() {
    const {email, token} = useAuth();
    const [todoStates, setTodoStates] = useState({total: 0, completed: 0, active: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const statsCardStyle = 'bg-glass backdrop-blur-md border border-border rounded-2xl p-5 flex flex-col gap-1';
    const statsTitleStyle = 'font-semibold text-text-muted uppercase tracking-wider flex justify-center';
    const statsStyle = 'text-3xl font-extrabold text-text-primary flex justify-center';
    const progressStyle = 'font-semibold text-text-muted';

    useEffect( () => {
        async function fetchTodoStats() {
            setError('');
            
            if (!token){
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

                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch todos')
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
            <div className={'mx-auto flex max-w-3xl flex-col gap-6 p-6'}>
                <div className={'h-9 w-32 animate-pulse rounded-full bg-border'}></div>
                <div className={'h-5 w-48 animate-pulse rounded-full bg-border'}></div>
                <div className={'grid grid-cols-1 gap-4 sm:grid-cols-3'}>
                    <div className={'h-24 animate-pulse rounded-2xl bg-border'}></div>
                    <div className={'h-24 animate-pulse rounded-2xl bg-border'}></div>
                    <div className={'h-24 animate-pulse rounded-2xl bg-border'}></div>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <div className={'h-5 w-40 animate-pulse rounded-full bg-border'}></div>
                    <div className={'h-3 w-full animate-pulse rounded-full bg-border'}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={'mx-auto flex max-w-3xl flex-col gap-6 p-6'}>
            <h2 className={'text-3xl font-extrabold text-text-primary'}>Profile</h2>
            <p className={'wrap-break-word text-text-muted'}>User: {email}</p>
            {error && 
                <p className={'rounded-lg bg-error/10 p-4 text-error'}>{error}</p>
            }
            <div className={'grid grid-cols-1 gap-4 sm:grid-cols-3'}>
                <div className={statsCardStyle}>
                    <p className={statsTitleStyle}>Total</p>
                    <p className={statsStyle}> {todoStates.total}</p>
                </div>
                <div className={statsCardStyle}>
                    <p className={statsTitleStyle}>Completed</p>
                    <p className={statsStyle}>{todoStates.completed}</p>
                </div>
                <div className={statsCardStyle}>
                    <p className={statsTitleStyle}>Active</p>
                    <p className={statsStyle}>{todoStates.active}</p>
                </div>
            </div>
            {todoStates.total > 0 &&
                <div className={'flex flex-col gap-2'}>
                    <div className={'flex justify-between'}>
                        <p className={progressStyle}>Completion Progress</p>
                        <p className={progressStyle}>{Math.round((todoStates.completed / todoStates.total) * 100)}%</p>
                    </div>
                    <div className={'h-3 overflow-hidden rounded-full bg-border'}>
                        <div className={'h-full rounded-full bg-accent transition-all duration-500'}
                             style={{width:`${Math.round((todoStates.completed / todoStates.total) * 100)}%`}}
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
        </div>
    );
}