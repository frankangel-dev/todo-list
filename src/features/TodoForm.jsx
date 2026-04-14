import {useRef, useState} from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../utils/todoValidation.js";

export default function TodoForm({onAddTodo}) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    const handleAddTodo = (e) => {
        e.preventDefault();
        
        if (workingTodoTitle && workingTodoTitle !== "") {
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle('');
            inputRef.current.focus();
        }
    };
    
    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                elementId={'todoTitle'}
                labelText={'Todo'}
                ref={inputRef}
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            />
            <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
        </form>
    );
}