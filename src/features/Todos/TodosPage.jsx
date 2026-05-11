import {useCallback, useEffect, useState} from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import SortBy from "../../shared/SortBy.jsx";
import useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

export default function TodosPage({token}) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);
    const [sortBy, setSortBy] = useState('creationDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    const [dataVersion, setDataVersion] = useState(0);
    const [filterError, setFilterError] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchTodos = async () => {
            setIsTodoListLoading(true);
            setError('');
            
            const paramsObject = {
                sortBy,
                sortDirection
            };

            if (debouncedFilterTerm) {
                paramsObject.find = debouncedFilterTerm;
            }
            
            const params = new URLSearchParams(paramsObject);
            
            try {
                const response = await fetch(`/api/tasks?${params}`, {
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
                setFilterError('');
                
            } catch (error) {
                if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                    setFilterError(`Error filtering/sorting todos: ${error.message}`);
                } else {
                    setError(`Error fetching todos: ${error.message}`);
                }
            } finally {
                setIsTodoListLoading(false);
            }
        };
        
        fetchTodos();
        
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);
    
    const invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1);
    }, []);
    
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
            invalidateCache();

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
            
            invalidateCache();

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

            invalidateCache();

        } catch (error) {
            setTodoList(todoList.map(todo => todo.id === editTodo.id ? originalTodo : todo));
            setError(`Error: ${error.message}`);
        }
    }

    const handleFilterChange = (newTerm) => {
        setFilterTerm(newTerm);
    };
    
    return (
        <>
            {error && 
                <div>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>Clear Error</button>
                </div>
            }
            
            {filterError && 
                <div>
                    <p>{filterError}</p>
                    <button onClick={() => setFilterError('')}>Clear Filter Error</button>
                    <button onClick={() => {
                        setFilterTerm('');
                        setSortBy('creationDate');
                        setSortDirection('desc');
                        setFilterError('');
                    }}>Reset Filters
                    </button>
                </div>
            }
            
            {isTodoListLoading && 
                <p>Loading...</p>
            }

            <SortBy 
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={setSortBy}
                onSortDirectionChange={setSortDirection}
            />

            <FilterInput
                filterTerm={filterTerm}
                onFilterChange={handleFilterChange}
            />

            <TodoForm 
                onAddTodo={addTodo}
            />
            
            <TodoList 
                todoList={todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                dataVersion={dataVersion}
            />
        </>
    );
}