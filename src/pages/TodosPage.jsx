import {useEffect, useReducer, useState} from "react";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import SortBy from "../shared/SortBy.jsx";
import useDebounce from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import {initialTodoState, TODO_ACTIONS, todoReducer} from "../reducers/todoReducer.js";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useSearchParams} from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";
import TrashToggle from "../shared/TrashToggle.jsx";
import EmptyTrashButton from "../features/Todos/EmptyTrashButton.jsx";
import BulkActionBar from "../features/Todos/BulkActionBar.jsx";
import {FolderProvider} from "../contexts/FolderContext.jsx";
import FolderManager from "../features/Folders/FolderManager.jsx";
import FolderFilter from "../shared/FolderFilter.jsx";

export default function TodosPage() {
  return (
    <FolderProvider>
      <TodosPageContent/>
    </FolderProvider>
  );
}

function TodosPageContent() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    isRefetching,
    selectedIds,
  } = state;
  const [isManagingFolders, setIsManagingFolders] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  // this makes the fetch below run again
  const refetchTodos = () => setRefreshCount(current => current + 1);
  const {token, email} = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  // sort/search/status all live in the URL so a refresh or a shared link keeps them
  const folder = searchParams.get('folder');
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirection = searchParams.get('sortDirection') || 'asc';
  const filterTerm = searchParams.get('find') || '';
  const trash = searchParams.get('trash');
  const inTrash = trash === 'true';
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const visibleTodos = todoList.filter(todo => !!todo.trash === inTrash);
  const completedCount = visibleTodos.filter(todo => todo.isCompleted).length;
  const percentDone = visibleTodos.length ? Math.round((completedCount / visibleTodos.length) * 100) : 0;

  // refetches whenever the sort or search changes
  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      dispatch({
        type: TODO_ACTIONS.FETCH_START
      });

      const paramsObject = {
        sortBy,
        sortDirection,
      };

      if (trash) {
        paramsObject.trash = trash;
      }

      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }

      if (folder) {
        paramsObject.folder = folder;
      }

      const params = new URLSearchParams(paramsObject);

      try {
        const response = await fetch(`/api/tasks?${params}`, {
          method: 'GET',
          headers: {'X-CSRF-TOKEN': token},
          credentials: 'include'
        });

        if (response.status === 404) {
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: {todos: []}
          });
          return;
        }

        if (!response.ok) {
          const error = new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch tasks');
          error.status = response.status;
          throw error;
        }

        const data = await response.json();
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: {todos: data.tasks}
        })

      } catch (error) {
        // 400 means the server actually rejected the sort or search
        const isFilterError = error.status === 400;

        dispatch(isFilterError
          ? {
            type: TODO_ACTIONS.FETCH_FILTER_ERROR,
            payload: {message: `Error filtering/sorting todos: ${error.message}`}
          }
          : {
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {message: `Error fetching todos: ${error.message}`}
          }
        );
      }
    };

    fetchTodos();

  }, [token, sortBy, sortDirection, debouncedFilterTerm, trash, folder, refreshCount]);

  async function addTodo(todoTitle, folderId) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
      folderId,
      trash: false,
      // shown as "Today" right away
      createdAt: new Date().toISOString(),
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
          isCompleted: newTodo.isCompleted,
          ...(folderId !== null && {folderId})
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

      refetchTodos();

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
          id: todo.id,
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

  async function restoreTodo(id) {
    const originalTodo = todoList.find(todo => todo.id === id);

    dispatch({
      type: TODO_ACTIONS.RESTORE_TODO_START,
      payload: {id}
    });

    try {
      const response = await fetch(`/api/tasks/${id}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to restore todo');
      }

      dispatch({
        type: TODO_ACTIONS.RESTORE_TODO_SUCCESS,
      });

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.RESTORE_TODO_ERROR,
        payload: {
          id,
          todo: originalTodo,
          message: `Error: ${error.message}`
        }
      });
    }
  }

  async function emptyTrash() {
    dispatch({
      type: TODO_ACTIONS.EMPTY_TRASH_START,
    });

    try {
      const response = await fetch(`/api/tasks/trash`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to trash todo');
      }

      dispatch({
        type: TODO_ACTIONS.EMPTY_TRASH_SUCCESS,
      });

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.EMPTY_TRASH_ERROR,
        payload: {
          todos: todoList,
          message: `Error: ${error.message}`
        }
      });
    }
  }

  async function bulkComplete(isCompleted) {
    if (selectedIds.length === 0) return;

    dispatch({
      type: TODO_ACTIONS.BULK_UPDATE_START,
      payload: {
        ids: selectedIds,
        changes: {isCompleted}
      }
    });

    try {
      const response = await fetch(`/api/tasks/bulk`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          taskId: selectedIds,
          isCompleted
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to complete todos');
      }

      dispatch({
        type: TODO_ACTIONS.BULK_UPDATE_SUCCESS,
      });

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.BULK_UPDATE_ERROR,
        payload: {
          todos: todoList,
          message: `Error: ${error.message}`
        }
      });
    }
  }
  
  async function bulkMove(folderId) {
    if (selectedIds.length === 0) return;

    const savedTodos = todoList;

    dispatch({
      type: TODO_ACTIONS.BULK_UPDATE_START,
      payload: {
        ids: selectedIds,
        changes: {folderId}
      }
    });

    try {
      const response = await fetch(`/api/tasks/bulk`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          taskId: selectedIds,
          folderId
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to move todos');
      }

      dispatch({
        type: TODO_ACTIONS.BULK_UPDATE_SUCCESS,
      });

      // it might not belong in the current folder
      refetchTodos();

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.BULK_UPDATE_ERROR,
        payload: {
          todos: savedTodos,
          message: `Error: ${error.message}`
        }
      });
    }
  }

  async function bulkDelete() {
    if (selectedIds.length === 0) return;

    dispatch({
      type: TODO_ACTIONS.BULK_UPDATE_START,
      payload: {
        ids: selectedIds,
        changes: {trash: true}
      }
    });

    try {
      const response = await fetch(`/api/tasks/bulk`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          taskId: selectedIds
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todos');
      }

      dispatch({
        type: TODO_ACTIONS.BULK_UPDATE_SUCCESS,
      });

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.BULK_UPDATE_ERROR,
        payload: {
          todos: todoList,
          message: `Error: ${error.message}`
        }
      });
    }
  }

  function toggleSelect(id) {
    dispatch({
      type: TODO_ACTIONS.TOGGLE_SELECT,
      payload: {
        id
      }
    });
  }

  function selectAll() {
    dispatch({
      type: TODO_ACTIONS.SELECT_ALL,
      payload: {
        ids: visibleTodos.map(todo => todo.id)
      }
    });
  }

  function clearSelection() {
    dispatch({
      type: TODO_ACTIONS.CLEAR_SELECTION
    });
  }

  // writes a search param, or drops it entirely when it's back to the default
  const setParam = (key, value, defaultValue) => {
    const next = new URLSearchParams(searchParams);

    if (!value || value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    // replace so typing in the search box doesn't fill up the back button
    setSearchParams(next, {replace: true});
  };

  const handleFilterChange = (newTerm) => {
    setParam('find', newTerm, '');
  };

  if (isTodoListLoading) {
    return (
      <div className={'mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12'} aria-busy={'true'}>
        <p className={'sr-only'} role={'status'}>Loading your to-dos</p>
        <div className={'h-10 w-52 animate-pulse rounded-full bg-surface'}></div>
        <div className={'h-20 w-full animate-pulse rounded-card bg-surface'}></div>
        <div className={'flex flex-wrap gap-3'}>
          <div className={'h-11 w-56 animate-pulse rounded-full bg-surface'}></div>
          <div className={'h-11 flex-1 animate-pulse rounded-full bg-surface'}></div>
          <div className={'h-11 w-36 animate-pulse rounded-full bg-surface'}></div>
        </div>
        <div className={'flex flex-col gap-3.5'}>
          <div className={'h-20 w-full animate-pulse rounded-card bg-surface'}></div>
          <div className={'h-20 w-full animate-pulse rounded-card bg-surface'}></div>
          <div className={'h-20 w-full animate-pulse rounded-card bg-surface'}></div>
          <div className={'h-20 w-full animate-pulse rounded-card bg-surface'}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={'mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12'}>
      <div className={'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'}>
        <div className={'flex flex-col gap-1'}>
          <h2
            className={'font-heading text-3xl wrap-break-word text-text-primary sm:text-4xl'}>
            {inTrash ? 'Trash' : `Hello, ${email.split('@')[0]}`}
          </h2>
          <p className={'text-body-sm text-text-muted'} role={'status'} aria-live={'polite'}>
            {inTrash
              ? `${visibleTodos.length} deleted ${visibleTodos.length === 1 ? 'task' : 'tasks'}`
              : `${completedCount} of ${visibleTodos.length} done | ${visibleTodos.length - completedCount} still active`}
          </p>
        </div>
        {!inTrash && todoList.length > 0 &&
          <div className={'flex flex-col gap-2 sm:w-48'}>
            <div className={'flex justify-between text-xs tracking-wider text-text-muted uppercase'}>
              <span>Progress</span>
              <span>{percentDone}%</span>
            </div>
            <div className={'h-3 overflow-hidden rounded-full bg-track ring-1 ring-border/50 ring-inset'}>
              <div className={'h-full rounded-full bg-accent-2 transition-all duration-500'}
                   style={{width: `${percentDone}%`}}
                   role={'progressbar'}
                   aria-label={'Completion progress'}
                   aria-valuenow={percentDone}
                   aria-valuemin={0}
                   aria-valuemax={100}
              >
              </div>
            </div>
          </div>
        }
      </div>

      {error &&
        <div className={'flex items-center gap-2 rounded-card bg-accent-soft p-4 text-error'} role={'alert'}>
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
        <div className={'flex items-center gap-2 rounded-card bg-accent-soft p-4 text-error'} role={'alert'}>
          <p>{filterError}</p>
          <button
            className={'cursor-pointer border-none bg-transparent text-xs font-semibold text-error underline'}
            onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR})}
          >
            Clear Filter Error
          </button>
          <button
            className={'cursor-pointer border-none bg-transparent text-xs font-semibold text-error underline'}
            onClick={() => {
              // filters live in the URL now, so clearing them means clearing the params
              setSearchParams(new URLSearchParams(), {replace: true});
              dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR});
            }}
          >
            Reset Filters
          </button>
        </div>
      }

      {/* no adding while you are looking at the trash */}
      {!inTrash &&
        <TodoForm
          onAddTodo={addTodo}
        />
      }

      <div className={'flex flex-col gap-5'}>
        {/* toolbar row 1: which list am I looking at */}
        <div className={'flex items-center gap-4'}>
          <TrashToggle/>

          {!inTrash &&
            <StatusFilter
              counts={{
                all: visibleTodos.length,
                active: visibleTodos.length - completedCount,
                completed: completedCount
              }}
            />
          }
        </div>

        {/* toolbar row 2: search gets its own row so it never gets squished */}
        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={handleFilterChange}
        />

        {/* toolbar row 3: on a phone the folder select stretches to fill the row */}
        <div className={'flex items-center gap-2 sm:gap-4'}>
          {!inTrash &&
            <FolderFilter
              onManageFolders={() => setIsManagingFolders(true)}
            />
          }

          <div className={'shrink-0 sm:ml-auto'}>
            <SortBy
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortByChange={(updatedSortBy) => setParam('sortBy', updatedSortBy, 'createdAt')}
              onSortDirectionChange={(updatedSortDirection) => setParam('sortDirection', updatedSortDirection, 'asc')}
            />
          </div>
        </div>

        {inTrash && visibleTodos.length > 0 &&
          <EmptyTrashButton onEmptyTrash={emptyTrash}/>
        }
      </div>

      {!inTrash &&
        <BulkActionBar
          selectedCount={selectedIds.length}
          onBulkComplete={bulkComplete}
          onBulkMove={bulkMove}
          onBulkDelete={bulkDelete}
          onClearSelection={clearSelection}
        />
      }

      {isManagingFolders &&
        <FolderManager
          onClose={() => setIsManagingFolders(false)}
          onFoldersChanged={refetchTodos}
        />
      }

      {/* inert also removes the dimmed rows from the tab order, not just from the mouse */}
      <div
        className={`transition-opacity duration-200 ${isRefetching ? 'pointer-events-none opacity-40' : 'opacity-100'}`}
        inert={isRefetching ? '' : undefined}
        aria-busy={isRefetching}>
        <TodoList
          todoList={visibleTodos}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
          onRestoreTodo={restoreTodo}
          statusFilter={statusFilter}
          inTrash={inTrash}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAll}
        />
      </div>
    </div>
  );
}
