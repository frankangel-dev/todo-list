import {useRef, useState} from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../utils/todoValidation.js";
import {sanitizeInput} from "../../utils/sanitize.js";

export default function TodoForm({onAddTodo}) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    
    const handleAddTodo = (e) => {
        e.preventDefault();
        
        if (isValidTodoTitle(workingTodoTitle)) {
            onAddTodo(sanitizeInput(workingTodoTitle));
            setWorkingTodoTitle('');
            inputRef.current.focus();
        }
    };
    
    return (
        <form onSubmit={handleAddTodo} className={'flex flex-col items-stretch gap-3 pb-4 sm:flex-row sm:items-center'} aria-label={'Add new todo'}>
            <TextInputWithLabel 
                elementId={'todoTitle'}
                labelText={'Todo'}
                ref={inputRef}
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
                placeholder={'Add a new to-do item'}
            />
            <button
                className={'w-full cursor-pointer rounded-full border-none bg-accent px-6 py-3 font-bold text-accent-text transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'}
                type="submit"
                disabled={!isValidTodoTitle(workingTodoTitle)}
            >
                Add To-do
            </button>
        </form>
    );
}