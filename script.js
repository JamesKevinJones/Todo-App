// Task Management Application
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentEditId = null;
        this.initializeEventListeners();
        this.renderTasks();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Modal close buttons
        document.querySelector('.close').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('saveEdit').addEventListener('click', () => {
            this.saveEdit();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                this.closeEditModal();
            }
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();

        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        input.value = '';
        input.focus();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.currentEditId = id;
            document.getElementById('editInput').value = task.text;
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('editInput').focus();
        }
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.currentEditId = null;
        document.getElementById('editInput').value = '';
    }

    saveEdit() {
        if (this.currentEditId === null) return;

        const newText = document.getElementById('editInput').value.trim();
        if (newText === '') {
            alert('Task cannot be empty!');
            return;
        }

        const task = this.tasks.find(t => t.id === this.currentEditId);
        if (task) {
            task.text = newText;
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
        }
    }

    formatDateTime(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    renderTasks() {
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);

        // Update counts
        document.getElementById('pendingCount').textContent = pendingTasks.length;
        document.getElementById('completedCount').textContent = completedTasks.length;

        // Render pending tasks
        this.renderTaskList('pendingTasks', pendingTasks, false);

        // Render completed tasks
        this.renderTaskList('completedTasks', completedTasks, true);
    }

    renderTaskList(listId, tasks, isCompleted) {
        const listElement = document.getElementById(listId);
        listElement.innerHTML = '';

        if (tasks.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'task-item empty';
            emptyItem.textContent = isCompleted 
                ? 'No completed tasks yet' 
                : 'No pending tasks. Add one above!';
            listElement.appendChild(emptyItem);
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${isCompleted ? 'completed' : ''}`;

            const taskText = document.createElement('div');
            taskText.className = `task-text ${isCompleted ? 'completed-text' : ''}`;
            taskText.textContent = task.text;

            const taskMeta = document.createElement('div');
            taskMeta.className = 'task-meta';
            
            const createdInfo = document.createElement('span');
            createdInfo.textContent = `Created: ${this.formatDateTime(task.createdAt)}`;
            taskMeta.appendChild(createdInfo);

            if (task.completed && task.completedAt) {
                const completedInfo = document.createElement('span');
                completedInfo.textContent = `Completed: ${this.formatDateTime(task.completedAt)}`;
                taskMeta.appendChild(completedInfo);
            }

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            if (!isCompleted) {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'btn btn-success';
                completeBtn.textContent = '✓ Complete';
                completeBtn.addEventListener('click', () => this.toggleComplete(task.id));
                taskActions.appendChild(completeBtn);
            } else {
                const uncompleteBtn = document.createElement('button');
                uncompleteBtn.className = 'btn btn-success';
                uncompleteBtn.textContent = '↩ Undo';
                uncompleteBtn.addEventListener('click', () => this.toggleComplete(task.id));
                taskActions.appendChild(uncompleteBtn);
            }

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-edit';
            editBtn.textContent = '✎ Edit';
            editBtn.addEventListener('click', () => this.openEditModal(task.id));
            taskActions.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-delete';
            deleteBtn.textContent = '🗑 Delete';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            taskActions.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(taskMeta);
            li.appendChild(taskActions);
            listElement.appendChild(li);
        });
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

