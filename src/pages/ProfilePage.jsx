import {useAuth} from "../contexts/AuthContext.jsx";
import {useEffect, useState} from "react";

export default function ProfilePage() {
    const {email, token} = useAuth();
    const [todoStates, setTodoStates] = useState({total: 0, completed: 0, active: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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
    return (
        <div>
            <h2>Profile</h2>
            <p>User: {email}</p>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <p>Total: {todoStates.total}</p>
            <p>Completed: {todoStates.completed}</p>
            <p>Active: {todoStates.active}</p>
            {todoStates.total > 0 && 
                <p>Completion Progress: {Math.round((todoStates.completed / todoStates.total) * 100)}%</p>}
        </div>
    );
}