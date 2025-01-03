const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const TODOS_FILE = path.join(__dirname, 'src/data/todos.json');

//app.use(bodyParser.json());
app.use(express.json());  // This allows the server to parse JSON bodies

// Fetch todos
app.get('/todos', (req, res) => {
  fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      return res.status(500).json({ error: 'Failed to read todos' });
    }

    console.log("Raw data from file:", data);  // Log the raw data from the file

    try {
      const todos = JSON.parse(data);
      console.log("Fetched todos:", todos);  // Log the todos data
      res.json(todos);  // Send only the JSON, no extra symbols
    } catch (e) {
      console.error("Error parsing JSON in todos.json:", e);
      res.status(500).json({ error: 'Invalid JSON in todos.json' });
    }
  });
});



// Add a todo
app.post('/todos', (req, res) => {

  console.log('Request body:', req.body);  // Log the incoming request body

  const newTodo = req.body;

  // Validation: Ensure that 'text' is provided in the body
  if (!newTodo.text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Read existing todos from the file
  fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading todos:', err);
      return res.status(500).json({ error: 'Failed to read todos' });
    }

    let todos = [];
    try {
      todos = JSON.parse(data);  // Parse existing todos from JSON
    } catch (e) {
      console.error('Error parsing todos:', e);
      return res.status(500).json({ error: 'Invalid todos data' });
    }

    // Assign a new ID for the todo and add it to the list
    //newTodo.id = todos.length + 1;
    todos.push(newTodo);

    // Write updated todos back to the file
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        console.error('Error writing todos:', err);
        return res.status(500).json({ error: 'Failed to write todos' });
      }

      // Respond with the new todo
      res.status(201).json(newTodo);
    });
  });
});



app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading todos file:', err);
      return res.status(500).json({ error: 'Failed to read todos' });
    }

    let todos = [];
    try {
      todos = JSON.parse(data);
    } catch (e) {
      console.error('Error parsing todos file:', e);
      return res.status(500).json({ error: 'Invalid JSON in todos file' });
    }

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Update the todo
    todos[todoIndex] = { ...todos[todoIndex], ...updatedData };

    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        console.error('Error writing todos file:', err);
        return res.status(500).json({ error: 'Failed to write todos' });
      }

      res.json(todos[todoIndex]);
    });
  });
});




// PATCH endpoint to update a todo by ID
/*app.patch('/todos/:id', (req, res) => {
  const { id } = req.params; // Extract the todo ID from the URL
  const updatedData = req.body; // Get the data to update

  // Read existing todos from the file
  fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading todos:', err);
      return res.status(500).json({ error: 'Failed to read todos' });
    }

    let todos = [];
    try {
      todos = JSON.parse(data); // Parse existing todos from JSON
    } catch (e) {
      console.error('Error parsing todos:', e);
      return res.status(500).json({ error: 'Invalid todos data' });
    }

    // Find the todo with the given ID
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).send('Todo not found');
    }

    // Update the todo item with the new data
    todos[todoIndex] = { ...todos[todoIndex], ...updatedData };

    // Write updated todos back to the file
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        console.error('Error writing todos:', err);
        return res.status(500).json({ error: 'Failed to write todos' });
      }

      // Send the updated todo back as a JSON response
      res.json(todos[todoIndex]);
    });
  });
});
*/




// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read todos' });
    }
    const todos = JSON.parse(data).filter((todo) => todo.id !== parseInt(id, 10));
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete todo' });
      }
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
