import TodoListItem from "./TodoListItem.jsx";
import {useMemo} from "react";

export default function TodoList({todoList, onCompleteTodo, onUpdateTodo, onDeleteTodo, dataVersion, statusFilter = 'all'}) {
    const filteredTodoList = useMemo(() => {
        let filteredTodos;
        switch (statusFilter) {
            case 'completed':
                filteredTodos = todoList.filter(todo => todo.isCompleted);
                break;
            case 'active':
                filteredTodos = todoList.filter(todo => !todo.isCompleted);
                break;
            default:
                filteredTodos = todoList;
                break;
        }
        return {
            version: dataVersion,
            todos: filteredTodos
        };
    }, [todoList, dataVersion, statusFilter]);

    const getEmptyMessage = () => {
        switch (statusFilter) {
            case 'completed':
                return 'No completed todos yet. Complete some tasks to see them here.';
            case 'active':
                return 'No active todos. Add a todo above to get started.';
            default:
                return 'Add todo above to get started.'
        }
    };
    
    return (
        filteredTodoList.todos.length === 0 ? (
            <p className={'px-0 py-8 text-center text-sm text-text-muted'} aria-live={'polite'}>{getEmptyMessage()}</p>
        ) : (
            <ul className={'flex list-none flex-col gap-3'} aria-label={'Todo list'}>
                {filteredTodoList.todos.map(todo => (
                    <TodoListItem 
                        key={todo.id}
                        todo={todo}
                        onCompleteTodo={onCompleteTodo}
                        onUpdateTodo={onUpdateTodo}
                        onDeleteTodo={onDeleteTodo}
                    />
                ))}
            </ul>
        )
    );
}