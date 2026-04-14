import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../utils/todoValidation.js";
import {useEditableTitle} from "../../hooks/useEditableTitle.js";

export default function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
    const {isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit} = useEditableTitle(todo.title);
    
    const handleEdit = (e) => {
        updateTitle(e.target.value);
    }

    const handleUpdate = (e) => {
        if (!isEditing) return;
        
        e.preventDefault();
        
        const finalTitle = finishEdit();
        onUpdateTodo({...todo, title: finalTitle});
    }
    
    return (
        <li>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                    <button type={"button"} onClick={cancelEdit}>Cancel</button>
                    <button type={"button"} onClick={handleUpdate} disabled={!isValidTodoTitle(workingTitle)}>Update</button>
                </form>
            ) : (
                <>
                    <input
                        type={"checkbox"}
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                    <span onClick={startEditing}>{todo.title}</span>
                </>
            )}
        </li>
    );
}