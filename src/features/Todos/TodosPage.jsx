import {useEffect, useState} from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";

export default function TodosPage({token}) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchTodos = async () => {
            setIsTodoListLoading(true);
            setError('');
            
            try {
                const response = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: {'X-CSRF-TOKEN': token},
                    credentials: 'include'
                });
                
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                
                const data = await response.json();
                setTodoList(data.tasks);
                
            } catch (error) {
                setError(`Error: ${error.name} | ${error.message}`);
            } finally {
                setIsTodoListLoading(false);
            }
        };
        
        fetchTodos();
        
    }, [token]);
    
    async function addTodo(todoTitle) {
        const newTodo = {
            id: Date.now(),
            title: todoTitle,
            isCompleted: false,
        };

        setTodoList(prev => [newTodo, ...prev]);

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title: newTodo.title,
                    isCompleted: newTodo.isCompleted
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const data = await response.json();
            
            setTodoList(prev => prev.map(todo => todo.id === newTodo.id ? {...data} : todo));
        } catch (error) {
            setError(`Error: ${error.message}`);
            setTodoList(prev => prev.filter(todo => todo.id !== newTodo.id));
        }
    }

    async function completeTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id);

        setTodoList(todoList.map(todo => todo.id === id ? {...todo, isCompleted: true} : todo));
        
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    isCompleted: true,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to complete todo');
            }
        } catch (error) {
            setTodoList(todoList.map(todo => todo.id === id ? originalTodo : todo));
            setError(`Error: ${error.message}`);
            
        }
    }

    async function updateTodo(editTodo) {
        const originalTodo = todoList.find(todo => todo.id === editTodo.id);
        
        setTodoList(todoList.map(todo => todo.id === editTodo.id ? {...editTodo} : todo));
        
        try {
            const response = await fetch(`/api/tasks/${editTodo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: editTodo.title,
                    isCompleted: editTodo.isCompleted,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
        } catch (error) {
            setTodoList(todoList.map(todo => todo.id === editTodo.id ? originalTodo : todo));
            setError(`Error: ${error.message}`);
        }
    }
    return (
        <>
            
            {error && 
                <div>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>Clear Error</button>
                </div>
            }
            {isTodoListLoading && <p>Loading...</p>}
                <TodoForm onAddTodo={addTodo}/>
                <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
        </>
    );
}