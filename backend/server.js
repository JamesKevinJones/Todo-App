const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let tasks = [];
let nextId = 1;

// Helper function to get current timestamp
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString();
};

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks - Add a new task
app.post('/tasks', (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }

    const newTask = {
        id: nextId++,
        text: text.trim(),
        isCompleted: false,
        timestamp: getTimestamp()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Toggle completion status
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.isCompleted = !task.isCompleted;
    task.timestamp = getTimestamp(); // Update timestamp when toggled

    res.json(task);
});

// DELETE /tasks/:id - Remove a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 To-Do API is ready!`);
});

