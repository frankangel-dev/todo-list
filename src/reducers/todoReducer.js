export const TODO_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  FETCH_FILTER_ERROR: 'FETCH_FILTER_ERROR',
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',
  DELETE_TODO_START: 'DELETE_TODO_START',
  DELETE_TODO_SUCCESS: 'DELETE_TODO_SUCCESS',
  DELETE_TODO_ERROR: 'DELETE_TODO_ERROR',
  RESTORE_TODO_START: 'RESTORE_TODO_START',
  RESTORE_TODO_SUCCESS: 'RESTORE_TODO_SUCCESS',
  RESTORE_TODO_ERROR: 'RESTORE_TODO_ERROR',
  EMPTY_TRASH_START: 'EMPTY_TRASH_START',
  EMPTY_TRASH_SUCCESS: 'EMPTY_TRASH_SUCCESS',
  EMPTY_TRASH_ERROR: 'EMPTY_TRASH_ERROR',
  BULK_UPDATE_START: 'BULK_UPDATE_START',
  BULK_UPDATE_SUCCESS: 'BULK_UPDATE_SUCCESS',
  BULK_UPDATE_ERROR: 'BULK_UPDATE_ERROR',
  TOGGLE_SELECT: 'TOGGLE_SELECT',
  SELECT_ALL: 'SELECT_ALL',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
};

export const initialTodoState = {
  todoList: [],
  selectedIds: [],
  error: '',
  filterError: '',
  isTodoListLoading: true,
  isRefetching: false,
  isInitialLoad: true,
  // sort, search and status filters live in the URL, so a refresh keeps them
};

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: state.isInitialLoad,
        isRefetching: !state.isInitialLoad,
        filterError: '',
        error: ''
      };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload.todos,
        isTodoListLoading: false,
        isRefetching: false,
        isInitialLoad: false,
      };
    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        todoList: [],
        isTodoListLoading: false,
        isRefetching: false,
        isInitialLoad: false,
        error: action.payload.message,
        filterError: ''
      };

    case TODO_ACTIONS.FETCH_FILTER_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        isRefetching: false,
        isInitialLoad: false,
        filterError: action.payload.message,
        error: ''
      };

    // optimistic updates
    // update the UI immediately on START, then confirm or rollback on SUCCESS/ERROR
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload.newTodo, ...state.todoList]
      };
    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            // keeps createdAt if the response omits one, so the
            // date tag shows right away instead of waiting for a refresh
            ? {createdAt: todo.createdAt, ...action.payload.savedTodo}
            : todo
        )
      };
    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.filter(todo =>
          todo.id !== action.payload.id
        ),
        error: action.payload.message
      };

    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            ? {...todo, isCompleted: action.payload.isCompleted}
            : todo
        )
      };
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return state;
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            ? action.payload.todo
            : todo
        ),
        error: action.payload.message
      };

    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            ? {...action.payload.editedTodo}
            : todo
        )
      };
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return state;
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            ? action.payload.todo
            : todo
        ),
        error: action.payload.message
      };

    case TODO_ACTIONS.DELETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.filter(todo =>
          todo.id !== action.payload.id
        )
      };
    case TODO_ACTIONS.DELETE_TODO_SUCCESS:
      return state;
    case TODO_ACTIONS.DELETE_TODO_ERROR:
      return {
        ...state,
        todoList: [action.payload.todo, ...state.todoList],
        error: action.payload.message
      };

    // a restored to-do is no longer trashed
    case TODO_ACTIONS.RESTORE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.filter(todo =>
          todo.id !== action.payload.id
        )
      };
    case TODO_ACTIONS.RESTORE_TODO_SUCCESS:
      return state;
    case TODO_ACTIONS.RESTORE_TODO_ERROR:
      return {
        ...state,
        todoList: [action.payload.todo, ...state.todoList],
        error: action.payload.message
      };

    // emptying the trash removes all rows at once
    case TODO_ACTIONS.EMPTY_TRASH_START:
      return {
        ...state,
        todoList: state.todoList.filter(todo => !todo.trash)
      };
    case TODO_ACTIONS.EMPTY_TRASH_SUCCESS:
      return state;
    case TODO_ACTIONS.EMPTY_TRASH_ERROR:
      return {
        ...state,
        todoList: action.payload.todos,
        error: action.payload.message
      };

    case TODO_ACTIONS.BULK_UPDATE_START:
      return {
        ...state,
        todoList: state.todoList.map(todo => 
          action.payload.ids.includes(todo.id)
            ? {...todo, ...action.payload.changes}
            : todo),
        selectedIds: []
      };
    case TODO_ACTIONS.BULK_UPDATE_SUCCESS:
      return state;
    case TODO_ACTIONS.BULK_UPDATE_ERROR:
      return {
        ...state,
        todoList: action.payload.todos,
        error: action.payload.message
      };

    case TODO_ACTIONS.TOGGLE_SELECT:
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload.id)
          ? state.selectedIds.filter(id => id !== action.payload.id)
          : [...state.selectedIds, action.payload.id]
      };
    case TODO_ACTIONS.SELECT_ALL:
      return {
        ...state,
        selectedIds: action.payload.ids.every(id =>
          state.selectedIds.includes(id))
          ? []
          : action.payload.ids
      };
    case TODO_ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedIds: []
      };
    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: ''
      };
    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: ''
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}