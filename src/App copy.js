import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

// Mock server (simulate todos.json as API)
const mockApi = {
  fetchTodos: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, text: 'Learn React', completed: false },
          { id: 2, text: 'Build a To-Do App', completed: false },
        ]);
      }, 500); // Simulate network delay
    }),
  addTodo: (todo) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(todo); // Simulates successful server addition
      }, 500);
    }),
  toggleTodo: (id, todos) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        resolve(updatedTodos);
      }, 500);
    }),
  deleteTodo: (id, todos) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        resolve(updatedTodos);
      }, 500);
    }),
};

const fetchTodos = async () => {
  const response = await fetch('/todos');
  return response.json();
};

const addTodo = async (todo) => {
  const response = await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  return response.json();
};

const toggleTodo = async (id) => {
  const response = await fetch(`/todos/${id}`, {
    method: 'PATCH',
  });
  return response.json();
};

const deleteTodo = async (id) => {
  await fetch(`/todos/${id}`, { method: 'DELETE' });
};


const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch todos from mock API
    mockApi.fetchTodos().then((data) => {
      setTodos(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };

    mockApi.addTodo(newTodo).then((addedTodo) => {
      setTodos((prevTodos) => [...prevTodos, addedTodo]);
    });
  };

  const handleToggle = (id) => {
    setLoading(true);
    mockApi.toggleTodo(id, todos).then((updatedTodos) => {
      setTodos(updatedTodos);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    setLoading(true);
    mockApi.deleteTodo(id, todos).then((updatedTodos) => {
      setTodos(updatedTodos);
      setLoading(false);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">To-Do App</h1>
        <TodoForm onAdd={handleAdd} />
        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default App;
