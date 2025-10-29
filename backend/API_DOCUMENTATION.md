# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Body:**
```json
{
  "name": "gayatri",
  "email": "gayatri@gmail.com",
  "password": "password123"
}
```
- **Success Response (201):**
```json
{
  "_id": "user_id",
  "name": "gayatri",
  "email": "gayatri@xyz.com",
  "token": "jwt_token_here"
}
```
- **Error Response (400):**
```json
{
  "message": "User already exists"
}
```

### Login User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Body:**
```json
{
  "email": "gayatri@xyz.com",
  "password": "password123"
}
```
- **Success Response (200):**
```json
{
  "_id": "user_id",
  "name": "gayatri",
  "email": "gayatri@xyz.com",
  "token": "jwt_token_here"
}
```
- **Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

### Get Current User Profile
- **URL:** `/auth/me`
- **Method:** `GET`
- **Access:** Private (requires JWT)
- **Headers:**
```
Authorization: Bearer <token>
```
- **Success Response (200):**
```json
{
  "_id": "user_id",
  "name": "gayatri",
  "email": "gayatri@xyz.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Tasks Endpoints

### Get All Tasks
- **URL:** `/tasks`
- **Method:** `GET`
- **Access:** Private (requires JWT)
- **Query Parameters:**
  - `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
  - `search` (optional): Search tasks by title (case-insensitive)
- **Examples:**
  - `/tasks` - Get all tasks
  - `/tasks?status=pending` - Get pending tasks
  - `/tasks?search=meeting` - Search tasks with "meeting" in title
  - `/tasks?status=completed&search=project` - Combined filter
- **Success Response (200):**
```json
[
  {
    "_id": "task_id",
    "title": "Complete project",
    "description": "Finish the web app",
    "status": "in-progress",
    "priority": "high",
    "user": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Single Task
- **URL:** `/tasks/:id`
- **Method:** `GET`
- **Access:** Private (requires JWT)
- **Success Response (200):**
```json
{
  "_id": "task_id",
  "title": "Complete project",
  "description": "Finish the web app",
  "status": "in-progress",
  "priority": "high",
  "user": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
- **Error Response (404):**
```json
{
  "message": "Task not found"
}
```

### Create Task
- **URL:** `/tasks`
- **Method:** `POST`
- **Access:** Private (requires JWT)
- **Body:**
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "status": "pending",
  "priority": "medium"
}
```
- **Field Validations:**
  - `title` (required): String, max 100 characters
  - `description` (optional): String, max 500 characters
  - `status` (optional): One of `pending`, `in-progress`, `completed` (default: `pending`)
  - `priority` (optional): One of `low`, `medium`, `high` (default: `medium`)
- **Success Response (201):**
```json
{
  "_id": "task_id",
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "user": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Task
- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **Access:** Private (requires JWT)
- **Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed",
  "priority": "high"
}
```
- **Note:** All fields are optional. Only provided fields will be updated.
- **Success Response (200):**
```json
{
  "_id": "task_id",
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed",
  "priority": "high",
  "user": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Delete Task
- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Access:** Private (requires JWT)
- **Success Response (200):**
```json
{
  "message": "Task removed"
}
```

---

## Health Check

### Server Health
- **URL:** `/health`
- **Method:** `GET`
- **Access:** Public
- **Success Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

