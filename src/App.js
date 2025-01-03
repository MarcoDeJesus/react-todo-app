import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos from the server (backend)
  const fetchTodos = async () => {
    try {
      const response = await fetch('/todos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Get the raw response text
      const rawData = await response.text();
      console.log('Raw Response:', rawData);  // Log the raw response
  
      // Clean up the response by trimming and removing the trailing '%' if any
      const cleanedData = rawData.replace('%', '').trim();
      console.log('Cleaned Data:', cleanedData);  // Log the cleaned data
  
      // Parse the cleaned data into JSON
      const data = JSON.parse(cleanedData);
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
  
  
  
  // Add a new todo
  const addTodo = async (todo) => {
    try {
      console.log('Todo to add:', todo);  // Log the todo data
  
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure it's set to JSON
        },
        body: JSON.stringify(todo),  // Make sure the body is stringified
      });

      const rawResponse = await response.text();  // Get the raw response as text
      console.log('Raw Response:', rawResponse);  // Log the response
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const addedTodo = JSON.parse(rawResponse);  // Attempt to parse it as JSON
      setTodos((prevTodos) => [...prevTodos, addedTodo]);  // Add the new todo to the state
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  
  
  // Toggle a todo (completed state)
  const toggleTodo = async (id) => {
    const updatedTodo = await fetch(`/todos/${id}`, { method: 'PATCH' });
    const updatedTodoData = await updatedTodo.json();
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedTodoData.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    await fetch(`/todos/${id}`, { method: 'DELETE' });
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  useEffect(() => {
    // Fetch todos when the component mounts
    fetchTodos().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">To-Do App</h1>
        <TodoForm onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </div>
    </div>
  );
};

export default App;
