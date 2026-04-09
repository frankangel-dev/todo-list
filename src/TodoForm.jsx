import { useRef } from "react";

export default function TodoForm({onAddTodo}) {
    const inputRef = useRef();
    const handleAddTodo = (e) => {
        e.preventDefault();

        const todoTitle = e.target.todoTitle.value.trim();
        
        if (todoTitle && todoTitle !== "") {
            onAddTodo(todoTitle);
            e.target.reset();
            inputRef.current.focus();
        }
    };
    
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input ref={inputRef} type="text" id="todoTitle" name="todoTitle" placeholder={'Todo Text'} required/>
            <button type="submit">Add Todo</button>
        </form>
    );
}