import {useRef, useState} from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../utils/todoValidation.js";
import {sanitizeInput} from "../../utils/sanitize.js";
import {useFolders} from "../../contexts/FolderContext.jsx";

export default function TodoForm({onAddTodo}) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [workingFolderId, setWorkingFolderId] = useState('');
  const {folders} = useFolders();

  const handleAddTodo = (e) => {
    e.preventDefault();

    if (isValidTodoTitle(workingTodoTitle)) {
      onAddTodo(
        sanitizeInput(workingTodoTitle),
        workingFolderId === '' ? null : Number(workingFolderId)
      );
      setWorkingTodoTitle('');
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}
          className={'flex flex-col items-stretch gap-3 rounded-card bg-surface p-3.5 shadow-sm sm:flex-row sm:items-center'}
          aria-label={'Add new todo'}>
      <TextInputWithLabel
        elementId={'todoTitle'}
        labelText={'Todo'}
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        placeholder={'Add a new to-do item'}
      />
      {folders.length > 0 &&
        <>
          <label htmlFor={'todoFolder'} className={'sr-only'}>Folder</label>
          <select
            className={'min-h-12 shrink-0 cursor-pointer rounded-full border border-border bg-bg pr-8 pl-4 text-body-sm text-text-primary'}
            id={'todoFolder'}
            value={workingFolderId}
            onChange={(e) => setWorkingFolderId(e.target.value)}
          >
            <option value={''}>No folder</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        </>
      }
      <button
        className={'flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-accent px-6 font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-45'}
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14"/>
          <path d="M12 5v14"/>
        </svg>
        Add to-do
      </button>
    </form>
  );
}
