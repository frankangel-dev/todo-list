import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../../utils/todoValidation.js";
import {useEditableTitle} from "../../../hooks/useEditableTitle.js";
import {sanitizeInput} from "../../../utils/sanitize.js";
import {useRef, useState} from "react";

export default function TodoListItem({todo, onCompleteTodo, onUpdateTodo, onDeleteTodo}) {
    const {isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit} = useEditableTitle(todo.title);
    // swipe to delete on mobile, track where the finger starts and how far it moves
    const startPositionX = useRef(null);
    const [swipePosition, setSwipePosition] = useState(0);
    
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
        startPositionX.current = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        // only allow leftward swipes and cap it at -120px so it doesn't go farther
        const positionMoved = e.touches[0].clientX - startPositionX.current;

        if (positionMoved > 0) {
            setSwipePosition(0);
        }
        else if (positionMoved < -120) {
            setSwipePosition(-120);
        } else {
            setSwipePosition(positionMoved);
        }
    }
    
    function handleTouchEnd() {
        // if the user swipes far enough, delete the to-do, otherwise snap the card back
        if (swipePosition < -80) {
            onDeleteTodo(todo.id);
        }

        setSwipePosition(0);
    }
    
    return (
        <div className={`group flex items-center gap-2 transition-all duration-150 hover:-translate-y-0.5`}>
            <div className={'relative flex-1 overflow-hidden rounded-2xl border border-border cursor-pointer transition-shadow duration-150 group-hover:shadow-md'}>
                <div className={`absolute inset-0 rounded-2xl flex items-center justify-end px-6 ${swipePosition < 0 ? 'bg-error' : ''}`}>
                    <svg className={'h-5 w-5 text-white'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                </div>
                <li className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${swipePosition < 0 ? 'bg-surface' : 'bg-glass backdrop-blur-md'}`}
                    aria-label={todo.title}
                    style={{transform: `translateX(${swipePosition}px)`, transition: swipePosition === 0 ? 'transform 0.3s ease' : 'none'}}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {isEditing ? (
                        <form
                            className={'flex w-full items-center gap-2'}
                            onSubmit={handleUpdate}
                            aria-label={'Edit todo'}
                        >
                            <TextInputWithLabel
                                elementId={'editTodoTitle'}
                                labelText={'Edit Todo'}
                                value={workingTitle}
                                onChange={handleEdit}
                                placeholder={'Cannot leave empty'}
                                maxLength={200}
                            />
                            <button
                                className={'cursor-pointer rounded-full border border-border bg-transparent px-3 py-1.5 text-sm font-semibold text-text-muted transition-all duration-150 hover:bg-border'}
                                type={"button"}
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                            <button
                                className={'cursor-pointer rounded-full border-none bg-accent px-3 py-1.5 text-sm font-semibold text-accent-text hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50'}
                                type={"submit"}
                                disabled={!isValidTodoTitle(workingTitle)}
                            >
                                Update
                            </button>
                        </form>
                    ) : (
                        <>
                            <button
                                className={`${todo.isCompleted ? 'line-through text-text-muted' : 'text-text-primary'} flex-1 cursor-pointer border-none bg-transparent text-left font-semibold`}
                                onClick={startEditing}
                                aria-label={`Edit: ${todo.title}`}
                            >
                                {todo.title}
                            </button>
                            <button
                                className={`${todo.isCompleted ? 'border-accent bg-accent' : 'border-border bg-transparent'} h-11 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-150 hover:bg-accent/50`}
                                type={'button'}
                                onClick={() => onCompleteTodo(todo)}
                                aria-label={todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                            </button>
                        </>
                    )}
                </li>
            </div>
            <button
                className={'hidden cursor-pointer rounded-full border border-error p-2 text-error hover:bg-error/30 md:block md:opacity-0 md:transition-opacity md:duration-150 md:group-hover:opacity-100 focus-visible:opacity-100'}
                type={'button'}
                onClick={() => onDeleteTodo(todo.id)}
                aria-label={`Delete: ${todo.title}`}
            >
                <svg className={'h-5 w-5'} xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"
                     data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
            </button>
        </div>
    );
}