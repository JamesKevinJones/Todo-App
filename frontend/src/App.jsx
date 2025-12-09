import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        text: newTaskText
      });
      setTasks([...tasks, response.data]);
      setNewTaskText('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <div className="app">
      <header className="app-header">
        <h1>My Tasks</h1>
      </header>

      <div className="app-container">
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter a new task..."
            className="task-input"
          />
          <button type="submit" className="btn-add">
            Add Task
          </button>
        </form>

        {loading && <div className="loading">Loading tasks...</div>}

        <div className="tasks-wrapper">
          <section className="tasks-section">
            <h2 className="section-title">
              Pending Tasks
              <span className="task-count">({pendingTasks.length})</span>
            </h2>
            <ul className="task-list">
              {pendingTasks.length === 0 ? (
                <li className="task-item empty">No pending tasks</li>
              ) : (
                pendingTasks.map(task => (
                  <li key={task.id} className="task-item">
                    <div className="task-content">
                      <span className="task-text">{task.text}</span>
                      <span className="task-time">{formatTime(task.timestamp)}</span>
                    </div>
                    <div className="task-actions">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className="btn-complete"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="tasks-section">
            <h2 className="section-title">
              Completed Tasks
              <span className="task-count">({completedTasks.length})</span>
            </h2>
            <ul className="task-list">
              {completedTasks.length === 0 ? (
                <li className="task-item empty">No completed tasks</li>
              ) : (
                completedTasks.map(task => (
                  <li key={task.id} className="task-item completed">
                    <div className="task-content">
                      <span className="task-text completed-text">{task.text}</span>
                      <span className="task-time">{formatTime(task.timestamp)}</span>
                    </div>
                    <div className="task-actions">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className="btn-undo"
                      >
                        Undo
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

