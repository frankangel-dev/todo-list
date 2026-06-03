import {useEffect, useReducer} from "react";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import SortBy from "../shared/SortBy.jsx";
import useDebounce from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import {todoReducer, initialTodoState, TODO_ACTIONS} from "../reducers/todoReducer.js";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useSearchParams} from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";

export default function TodosPage() {
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
    const {
        todoList,
        error,
        filterError,
        isTodoListLoading,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion
    } = state;
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    const {token, email} = useAuth();
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || 'all';

    useEffect(() => {
        if (!token) return;

        const fetchTodos = async () => {
            dispatch({type: TODO_ACTIONS.FETCH_START});

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
                dispatch({
                    type: TODO_ACTIONS.FETCH_SUCCESS,
                    payload: {todos: data.tasks}
                })

            } catch (error) {
                if (debouncedFilterTerm || sortBy !== 'createdDate' || sortDirection !== 'asc') {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            isFilterError: true,
                            isError: false,
                            message: `Error filtering/sorting todos: ${error.message}`
                        }
                    });
                } else {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            isFilterError: false,
                            isError: true,
                            message: `Error fetching todos: ${error.message}`
                        }
                    });
                }
            }
        };

        fetchTodos();

    }, [token, sortBy, sortDirection, debouncedFilterTerm]);


    async function addTodo(todoTitle) {
        const newTodo = {
            id: Date.now(),
            title: todoTitle,
            isCompleted: false,
        };

        dispatch({
            type: TODO_ACTIONS.ADD_TODO_START,
            payload: {newTodo}
        });

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

            dispatch({
                type: TODO_ACTIONS.ADD_TODO_SUCCESS,
                payload: {
                    id: newTodo.id,
                    savedTodo: data
                }
            });

        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: {
                    id: newTodo.id,
                    message: `Error: ${error.message}`
                }
            });
        }
    }

    async function completeTodo(todo) {
        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: {
                id: todo.id,
                isCompleted: !todo.isCompleted
            }
        });

        try {
            const response = await fetch(`/api/tasks/${todo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    isCompleted: !todo.isCompleted,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to toggle todo status');
            }

            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
            });

        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    id:todo.id,
                    todo,
                    message: `Error: ${error.message}`
                }
            });

        }
    }

    async function updateTodo(editTodo) {
        const originalTodo = todoList.find(todo => todo.id === editTodo.id);

        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_START,
            payload: {
                id: editTodo.id,
                editedTodo: editTodo
            }
        });

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

            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_SUCCESS
            });

        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: {
                    id: editTodo.id,
                    todo: originalTodo,
                    message: `Error: ${error.message}`
                }
            });
        }
    }

    async function deleteTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id);

        dispatch({
            type: TODO_ACTIONS.DELETE_TODO_START,
            payload: {id}
        });

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            dispatch({
                type: TODO_ACTIONS.DELETE_TODO_SUCCESS,
            });

        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.DELETE_TODO_ERROR,
                payload: {
                    id,
                    todo: originalTodo,
                    message: `Error: ${error.message}`
                }
            });

        }
    }
    
    const handleFilterChange = (newTerm) => {
        dispatch({
            type: TODO_ACTIONS.SET_FILTER,
            payload: {
                filterTerm: newTerm
            }
        });
    };

    if (isTodoListLoading) {
        return (
            <div className={'mx-auto flex max-w-2xl flex-col gap-6 px-6 py-5'}>
                <div className={'h-9 w-48 animate-pulse rounded-full bg-border'}></div>
                <div className={'flex justify-center gap-4'}>
                    <div className={'h-10 w-32 animate-pulse rounded-lg bg-border'}></div>
                    <div className={'h-10 w-32 animate-pulse rounded-lg bg-border'}></div>
                </div>
                <div className={'flex justify-center gap-2'}>
                    <div className={'h-10 w-16 animate-pulse rounded-full bg-border'}></div>
                    <div className={'h-10 w-20 animate-pulse rounded-full bg-border'}></div>
                    <div className={'h-10 w-24 animate-pulse rounded-full bg-border'}></div>
                </div>
                <div className={'h-12 w-full animate-pulse rounded-full bg-border'}></div>
                <div className={'h-12 w-full animate-pulse rounded-full bg-border'}></div>
                <div className={'flex flex-col gap-3'}>
                    <div className={'h-16 w-full animate-pulse rounded-2xl bg-border'}></div>
                    <div className={'h-16 w-full animate-pulse rounded-2xl bg-border'}></div>
                    <div className={'h-16 w-full animate-pulse rounded-2xl bg-border'}></div>
                    <div className={'h-16 w-full animate-pulse rounded-2xl bg-border'}></div>
                    <div className={'h-16 w-full animate-pulse rounded-2xl bg-border'}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={'mx-auto flex max-w-2xl flex-col gap-6 px-6 py-5'}>
            <h2 className={'text-3xl font-extrabold wrap-break-word text-text-primary'}>Hello, {email.split('@')[0]}</h2>
            {error &&
                <div className={'flex items-center gap-2 rounded-lg bg-error/10 p-4 text-error'}>
                    <p>{error}</p>
                    <button
                        className={'cursor-pointer border-none bg-transparent text-xs font-semibold text-error underline'}
                        onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}
                    >
                        Clear Error
                    </button>
                </div>
            }
            
            {filterError &&
                <div className={'flex items-center gap-2 rounded-lg bg-error/10 p-4 text-error'}>
                    <p>{filterError}</p>
                    <button
                        className={'cursor-pointer border-none bg-transparent text-xs font-semibold text-error underline'}
                        onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR})}
                    >
                        Clear Filter Error
                    </button>
                    <button
                        className={'cursor-pointer border-none bg-transparent text-xs font-semibold text-error underline'}
                        onClick={() => dispatch({type: TODO_ACTIONS.RESET_FILTERS})}
                    >
                        Reset Filters
                    </button>
                </div>
            }

            <SortBy
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={(updatedSortBy) =>
                    dispatch({
                        type: TODO_ACTIONS.SET_SORT,
                        payload: {
                            sortBy: updatedSortBy,
                            sortDirection
                        }})
                }
                onSortDirectionChange={(updatedSortDirection) =>
                    dispatch({
                        type: TODO_ACTIONS.SET_SORT,
                        payload: {
                            sortBy,
                            sortDirection: updatedSortDirection
                        }})
                }
            />

            <StatusFilter/>

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
                onDeleteTodo={deleteTodo}
                dataVersion={dataVersion}
                statusFilter={statusFilter}
            />
        </div>
    );
}