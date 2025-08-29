
# Task Manager (MERN + JWT)

A clean, interview-ready **Task Manager** with authentication, built on **MongoDB, Express, React, Node.js**.

## Features
- User signup/login with JWT
- Create, read, update, delete tasks
- Mark complete / incomplete
- Simple React frontend consuming the API
- Clean, readable code and clear README

## Project Structure
```
task-manager-mern/
├─ backend/
│  ├─ server.js
│  ├─ models/
│  │  ├─ User.js
│  │  └─ Task.js
│  ├─ routes/
│  │  ├─ auth.js
│  │  └─ tasks.js
│  └─ middleware/
│     └─ auth.js
├─ frontend/
│  ├─ index.html
│  └─ src/
│     ├─ main.jsx
│     └─ App.jsx
└─ README.md
```

## Backend Setup
```bash
cd backend
npm install
# Create .env (see .env.example)
npm start
```
**.env.example**
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=supersecretkey
```

## Frontend Setup
No build required: the frontend uses React via CDN for speed.
Just open `frontend/index.html` in your browser after the backend is running.
(Or serve it with any static server.)

## API
- `POST /api/auth/register` {name, email, password}
- `POST /api/auth/login` {email, password}
- `GET /api/tasks` (Auth)
- `POST /api/tasks` {title} (Auth)
- `PATCH /api/tasks/:id` {title?, completed?} (Auth)
- `DELETE /api/tasks/:id` (Auth)
