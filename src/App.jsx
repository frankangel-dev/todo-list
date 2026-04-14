import './App.css'
import TodoList from "./TodoList.jsx";
import TodoForm from "./TodoForm.jsx";
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
        const newArr = todoList.map(todo => todo.id === id ? ({...todo, isCompleted: true}) : todo);
        setTodoList(newArr);
    }
    
    return (
        <div>
          <h1>My Todos</h1>
          <TodoForm onAddTodo={addTodo}/>
          <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
        </div>
    );
}

export default App
