# To-Do Web Application - Full Stack

A full-stack To-Do application built with React (Vite) frontend and Node.js/Express backend.

## Project Structure

```
Task 2/
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Installation Commands

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload (requires nodemon):
```bash
npm run dev
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /tasks` - Retrieve all tasks
- `POST /tasks` - Add a new task (body: `{ text: "task text" }`)
- `PUT /tasks/:id` - Toggle completion status
- `DELETE /tasks/:id` - Remove a task

## Features

- ✅ Add new tasks
- ✅ View pending and completed tasks in separate sections
- ✅ Toggle task completion status
- ✅ Delete tasks
- ✅ Timestamp display for each task
- ✅ Dark mode UI with teal accents
- ✅ Responsive design

## Running the Application

1. Start the backend server first (in the `backend` directory)
2. Then start the frontend development server (in the `frontend` directory)
3. Open `http://localhost:3000` in your browser

