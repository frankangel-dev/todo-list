import TodoListItem from "./TodoListItem.jsx";
import {useMemo} from "react";
import {useFolders} from "../../../contexts/FolderContext.jsx";

export default function TodoList({
                                   todoList,
                                   onCompleteTodo,
                                   onUpdateTodo,
                                   onDeleteTodo,
                                   onRestoreTodo,
                                   statusFilter = 'all',
                                   inTrash = false,
                                   selectedIds = [],
                                   onToggleSelect,
                                   onSelectAll,
                                   isSelecting = false
                                 }) {
  const {folders} = useFolders();
  // the API sends everything, All/Active/Done gets filtered here
  const filteredTodos = useMemo(() => {
    // status filter only makes sense for live tasks, not deleted ones
    if (inTrash) return todoList;

    switch (statusFilter) {
      case 'completed':
        return todoList.filter(todo => todo.isCompleted);
      case 'active':
        return todoList.filter(todo => !todo.isCompleted);
      default:
        return todoList;
    }
  }, [todoList, statusFilter, inTrash]);

  const getEmptyMessage = () => {
    if (inTrash) {
      return {title: 'Trash is empty', body: 'Anything you delete lands here first, so you can get it back.'};
    }

    switch (statusFilter) {
      case 'completed':
        return {title: 'Nothing done yet', body: 'Finish a task and it will show up here.'};
      case 'active':
        return {title: 'All caught up', body: 'Nothing left to do. Add something above if you want.'};
      default:
        return {title: 'Your list is empty', body: 'Add a to-do above to get started.'};
    }
  };

  const emptyMessage = getEmptyMessage();
  const allVisibleSelected = filteredTodos.length > 0 &&
    filteredTodos.every(todo => selectedIds.includes(todo.id));
  const folderNames = useMemo(
    () => new Map(folders.map(folder => [folder.id, folder.name])),
    [folders]
  );

  return (
    filteredTodos.length === 0 ? (
      <div className={'flex flex-col items-center gap-4 px-6 py-14 text-center'} aria-live={'polite'}>
        <span className={'flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft text-accent'}>
          {inTrash ? (
            // bin for the trash, checklist for everything else
            <svg className={'h-10 w-10'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          ) : (
            <svg className={'h-10 w-10'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 5h8"/>
              <path d="M13 12h8"/>
              <path d="M13 19h8"/>
              <path d="m3 17 2 2 4-4"/>
              <rect x="3" y="4" width="6" height="6" rx="1"/>
            </svg>
          )}
        </span>
        <h3 className={'font-heading text-2xl text-text-primary'}>{emptyMessage.title}</h3>
        <p className={'max-w-xs text-body-sm text-text-muted'}>{emptyMessage.body}</p>
      </div>
    ) : (
      <div className={'flex flex-col gap-3'}>
        {/* only selects what is on screen, and only while selection mode is on */}
        {!inTrash && isSelecting && onSelectAll &&
          <button
            className={'flex cursor-pointer items-center gap-2.5 self-start border-none bg-transparent pl-5 text-sm font-semibold text-text-muted'}
            type={'button'}
            onClick={onSelectAll}
            aria-pressed={allVisibleSelected}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-150 ${allVisibleSelected ? 'bg-accent text-accent-text' : 'border-2 border-text-muted/60'}`}>
              {allVisibleSelected &&
                <svg className={'h-3.5 w-3.5'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              }
            </span>
            {allVisibleSelected ? 'Clear selection' : `Select all ${filteredTodos.length}`}
          </button>
        }
        <ul className={'flex list-none flex-col gap-3.5'} aria-label={'Todo list'}>
          {filteredTodos.map(todo => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
              onRestoreTodo={onRestoreTodo}
              isSelected={selectedIds.includes(todo.id)}
              onToggleSelect={inTrash || !isSelecting ? undefined : onToggleSelect}
              folderName={folderNames.get(todo.folderId)}
            />
          ))}
        </ul>
      </div>
    )
  );
}
