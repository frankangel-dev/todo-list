import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../../utils/todoValidation.js";
import {useEditableTitle} from "../../../hooks/useEditableTitle.js";
import {sanitizeInput} from "../../../utils/sanitize.js";
import {useEffect, useRef, useState} from "react";

// how far the card can slide, and how far it has to go before letting go deletes it
const SWIPE_MAX = 120;
const SWIPE_DELETE_AT = 80;

// the date tag shown at the right of each row
function formatCreatedAt(value) {
  if (!value) return '';

  const created = new Date(value);
  if (Number.isNaN(created.getTime())) return '';

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysApart = Math.round((startOfDay(new Date()) - startOfDay(created)) / 86400000);

  if (daysApart === 0) return 'Today';
  if (daysApart === 1) return 'Yesterday';

  return created.toLocaleDateString(undefined, {day: 'numeric', month: 'short'});
}

export default function TodoListItem({
                                       todo,
                                       onCompleteTodo,
                                       onUpdateTodo,
                                       onDeleteTodo,
                                       onRestoreTodo,
                                       isSelected = false,
                                       onToggleSelect,
                                       folderName
                                     }) {
  const {isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit} = useEditableTitle(todo.title);
  // swipe to delete on mobile, track where the finger starts and how far it moves
  const startPositionX = useRef(null);
  const [swipePosition, setSwipePosition] = useState(0);
  const editInputRef = useRef(null);
  const createdLabel = formatCreatedAt(todo.createdAt);

  // focus the field as soon as editing starts so the keyboard opens without a second tap
  useEffect(() => {
    if (!isEditing) return;

    const input = editInputRef.current;
    if (!input) return;

    input.focus();
    // put the caret at the end rather than selecting the whole title
    input.setSelectionRange(input.value.length, input.value.length);
  }, [isEditing]);

  const handleEdit = (e) => {
    updateTitle(e.target.value);
  }

  const handleUpdate = (e) => {
    if (!isEditing) return;

    e.preventDefault();

    const finalTitle = finishEdit();
    onUpdateTodo({...todo, title: sanitizeInput(finalTitle)});
  }

  function handleTouchStart(e) {
    // no swiping while editing, otherwise dragging the text cursor slides the card
    if (isEditing) return;

    startPositionX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    if (isEditing || startPositionX.current === null) return;

    // negative means the swipe moved left, which is the only direction that deletes
    const positionMoved = e.touches[0].clientX - startPositionX.current;

    if (positionMoved > 0) {
      setSwipePosition(0);
    } else if (positionMoved < -SWIPE_MAX) {
      // stop the card at the edge of the red panel so it can't be dragged off screen
      setSwipePosition(-SWIPE_MAX);
    } else {
      setSwipePosition(positionMoved);
    }
  }

  function handleTouchEnd() {
    if (isEditing) return;

    // if the user swipes far enough, delete the to-do, otherwise snap the card back
    if (swipePosition < -SWIPE_DELETE_AT) {
      onDeleteTodo(todo.id);
    }

    startPositionX.current = null;
    setSwipePosition(0);
  }

  // deleted tasks are read only, all you can do is restore them
  if (todo.trash) {
    return (
      <li className={'relative overflow-hidden rounded-card'}>
        <div className={'flex items-center gap-4 rounded-card bg-surface/55 py-5 pr-3 pl-5'}>
          <span className={'flex-1 text-item font-medium text-text-muted line-through'}>
            {todo.title}
          </span>
          <button
            className={'flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
            type={'button'}
            onClick={() => onRestoreTodo(todo.id)}
            aria-label={`Restore: ${todo.title}`}
          >
            <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9"/>
              <path d="M3 5v4h4"/>
            </svg>
            Restore
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={'relative overflow-hidden rounded-card'}>
        <div aria-hidden={'true'}
          className={`absolute inset-0 flex items-center justify-end gap-2 rounded-card px-6 text-sm font-semibold text-accent-text ${swipePosition < 0 ? 'bg-accent-hover' : ''}`}>
          {swipePosition < 0 &&
            <>
              <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Delete
            </>
          }
        </div>
        <div
          className={`relative flex items-center gap-2 rounded-card py-5 pl-5 pr-3 transition-colors duration-150 ${isEditing ? 'bg-edit shadow-md' : isSelected ? 'bg-accent-soft shadow-sm' : todo.isCompleted ? 'bg-surface/55' : 'bg-surface shadow-sm'}`}
          style={{
            transform: `translateX(${swipePosition}px)`,
            transition: swipePosition === 0 ? 'transform 0.3s ease' : 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* hidden while editing so the row keeps its width */}
          {onToggleSelect && !isEditing &&
            <button
              className={'flex h-11 w-8 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent'}
              type={'button'}
              onClick={() => onToggleSelect(todo.id)}
              aria-pressed={isSelected}
              aria-label={`Select "${todo.title}"`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-150 ${isSelected ? 'bg-accent text-accent-text' : 'border-2 border-text-muted/60'}`}>
                {isSelected &&
                  <svg className={'h-3.5 w-3.5'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                }
              </span>
            </button>
          }

          <button
            className={`${isEditing ? 'hidden' : 'flex'} h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent transition-colors duration-150`}
            type={'button'}
            onClick={() => onCompleteTodo(todo)}
            aria-pressed={todo.isCompleted}
            aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full ${todo.isCompleted ? 'bg-accent-2 text-accent-text' : 'border-2 border-text-muted/60'}`}>
                {todo.isCompleted &&
                  <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                }
            </span>
          </button>

          {isEditing ? (
            <form
              className={'flex w-full flex-col items-stretch gap-2 [&_input]:border-text-primary/60 sm:flex-row sm:items-center'}
              onSubmit={handleUpdate}
              onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
              aria-label={'Edit todo'}
            >
              <TextInputWithLabel
                ref={editInputRef}
                elementId={`editTodoTitle-${todo.id}`}
                labelText={'Edit Todo'}
                value={workingTitle}
                onChange={handleEdit}
                placeholder={'Cannot leave empty'}
                maxLength={200}
              />
              {/* buttons sit on their own row on phones so the input keeps the full width */}
              <div className={'flex items-center gap-2'}>
                <button
                  className={'min-h-11 flex-1 cursor-pointer rounded-full border border-text-primary/60 bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 sm:flex-none dark:hover:bg-white/10'}
                  type={"button"}
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button
                  className={'min-h-11 flex-1 cursor-pointer rounded-full border-none bg-accent px-4 text-sm font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none'}
                  type={"submit"}
                  disabled={!isValidTodoTitle(workingTitle)}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <button
                className={`${todo.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'} ml-2 flex-1 cursor-pointer border-none bg-transparent text-left text-item font-medium`}
                onClick={startEditing}
                aria-label={`Edit: ${todo.title}`}
              >
                {todo.title}
              </button>
              {/* folder tag, only when the task is in a folder */}
              {folderName &&
                <span
                  className={'hidden shrink-0 items-center gap-1.5 rounded-full bg-bg px-3 py-1 text-meta font-semibold text-text-muted sm:inline-flex'}>
                  <svg className={'h-3 w-3'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 20h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7.5l-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z"/>
                  </svg>
                  {folderName}
                </span>
              }
              {/* date tags are hidden on the small screens so long titles keep their room */}
              {createdLabel &&
                <span className={`hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-meta font-semibold sm:inline-flex ${todo.isCompleted ? 'bg-accent-2-soft text-accent-2' : 'bg-bg text-text-muted'}`}>
                  {todo.isCompleted &&
                    <svg className={'h-3 w-3'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                         aria-hidden="true">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  }
                  {todo.isCompleted ? 'Done' : createdLabel}
                </span>
              }
              <button
                className={'hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-muted transition-colors duration-150 hover:bg-accent-soft hover:text-accent sm:flex'}
                type={'button'}
                onClick={() => onDeleteTodo(todo.id)}
                aria-label={`Delete: ${todo.title}`}
              >
                <svg className={'h-5 w-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </>
          )}
        </div>
    </li>
  );
}
