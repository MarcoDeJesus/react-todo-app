import React, { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const newTodo = { 
        text: text, 
        completed: false, 
        // Add an id or generate one (or let the server handle the id)
        // For simplicity, we'll use the current timestamp as a pseudo-id
        id: Date.now() 
      };
      onAdd(newTodo);  // Passing the whole newTodo object to onAdd
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Add a new task..." 
      />
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
};

export default TodoForm;

