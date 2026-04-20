import './App.css'
import TodoList from "./features/TodoList/TodoList.jsx";
import TodoForm from "./features/TodoForm.jsx";
import {useState} from "react";

function App() {
    const [todoList, setTodoList] = useState([]);

    function addTodo(todoTitle) {
        const newTodo = {
            id: Date.now(),
            title: todoTitle,
            isCompleted: false,
        };
        
        setTodoList(prev => [newTodo, ...prev]);
    }
    
    function completeTodo(id) {
        const newArr = todoList.map(todo => todo.id === id ? {...todo, isCompleted: true} : todo);
        setTodoList(newArr);
    }
    
    function updateTodo(editTodo) {
        const newArr = todoList.map(todo => todo.id === editTodo.id ? {...editTodo} : todo);
        setTodoList(newArr);
    }
    
    return (
        <div>
          <h1>My Todos</h1>
          <TodoForm onAddTodo={addTodo}/>
          <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
        </div>
    );
}

export default App
