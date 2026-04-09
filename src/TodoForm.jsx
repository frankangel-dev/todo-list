import {useRef, useState} from "react";

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
            <label htmlFor="todoTitle">Todo</label>
            <input 
                ref={inputRef}
                type="text" id="todoTitle"
                value={workingTodoTitle}
                name="todoTitle"
                placeholder={'Todo Text'}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
                required/>
            <button type="submit" disabled={!workingTodoTitle.trim()}>Add Todo</button>
        </form>
    );
}