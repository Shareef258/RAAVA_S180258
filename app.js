

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);
//function is used to Fetch the data from json place holder
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
// Adding data into the Json place holder 
  const addTodo = async () => {
    if (newTodo.trim() === '') return;

    const newTodoObj = {
      userId: 1,
      id: todos.length + 1,
      title: newTodo,
      completed: false,
    };

    setTodos([...todos, newTodoObj]);

    try {
      await axios.post(API_URL, newTodoObj);
    } catch (error) {
      console.error('Error adding todo:', error);
    }

    setNewTodo('');
  };
// update the newtodo in the data 
  const updateTodo = async (id, updatedTitle) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: updatedTitle } : todo
    );

    setTodos(updatedTodos);

    try {
      await axios.put(`${API_URL}/${id}`, { title: updatedTitle });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
// deleting todo in the data 
  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);

    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
// this is used to toggle nature of the list to completd or incomplete
  const toggleCompleted = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);

    try {
      await axios.patch(`${API_URL}/${id}`, {
        completed: !todos.find((todo) => todo.id === id).completed,
      });
    } catch (error) {
      console.error('Error updating todo completion status:', error);
    }
  };

  const filteredTodos = filterCompleted
    ? todos.filter((todo) => todo.completed)
    : todos;
  return (
    <div style={{ textAlign: 'left' }}>
      <center>
        <div class="header">
          <h1>Todo App</h1>
          <div>
            <input
              type="text"
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button onClick={addTodo}>Add Todo</button>
          </div>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={filterCompleted}
              onChange={() => setFilterCompleted(!filterCompleted)}
            />
            Show Completed
          </label>
        </div>
      </center>
      <table className="table">
        <tbody>
          {filteredTodos.map((todo) => (
            <tr key={todo.id} style={{ marginBottom: '10px', border: '2px solid black' }}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {todo.completed && <span style={{ fontSize: '20px', marginRight: '10px' }}>✓</span>}
                  <span >
                    {todo.title}
                  </span>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <button onClick={() => toggleCompleted(todo.id)}>
                      {todo.completed ? 'Incomplete' : 'Completed'}
                    </button>
                    <button
                      onClick={() =>
                        updateTodo(
                          todo.id,
                          prompt('Enter updated title:', todo.title)
                        )
                      }
                    >
                      Update
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoApp;
