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
    const {token} = useAuth();
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

    async function completeTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id);

        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: {id}
        });

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

            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
            });

        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    id,
                    todo: originalTodo,
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

    const handleFilterChange = (newTerm) => {
        dispatch({
            type: TODO_ACTIONS.SET_FILTER,
            payload: {
                filterTerm: newTerm
            }
        });
    };

    return (
        <>
            {error &&
                <div>
                    <p>{error}</p>
                    <button onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
                </div>
            }

            {filterError &&
                <div>
                    <p>{filterError}</p>
                    <button onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR})}>Clear Filter Error</button>
                    <button onClick={() => dispatch({type: TODO_ACTIONS.RESET_FILTERS})}>Reset Filters</button>
                </div>
            }

            {isTodoListLoading &&
                <p>Loading...</p>
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
                dataVersion={dataVersion}
                statusFilter={statusFilter}
            />
        </>
    );
}