# Blog Multi-User System Design

## 1. Project Overview

- **Project Name**: AI Generate Blog System - Multi-User
- **Goal**: Support multiple users with different roles for publishing articles

## 2. User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: manage all posts, manage users, settings |
| **Editor** | Edit/delete all posts, publish/unpublish |
| **Author** | Create/edit own posts, cannot publish |

## 3. Data Model

### Users Table (updated)
```
id: SERIAL PRIMARY KEY
email: VARCHAR(255) UNIQUE NOT NULL
password: VARCHAR(255) NOT NULL
name: VARCHAR(255)
role: VARCHAR(50) DEFAULT 'author'  -- admin, editor, author
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Posts Table (updated)
```
author_id: INTEGER REFERENCES users(id)
```

## 4. Features

### 4.1 User Registration
- Admin can create new users
- Fields: email, password, name, role
- Default role: Author

### 4.2 User Login
- Continue using NextAuth.js
- Add role to session

### 4.3 Permission System
- Middleware to check permissions
- UI: Show/hide actions based on role

### 4.4 Dashboard
- Admin: See all users, manage users
- All: See posts by role

## 5. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users (admin only) |
| POST | /api/users | Create user (admin only) |
| PUT | /api/users/[id] | Update user |
| DELETE | /api/users/[id] | Delete user (admin only) |

## 6. UI Pages

- `/admin/users` - User management (admin only)
- `/admin/users/new` - Create user

## 7. Environment

- **Preview**: Test database
- **Production**: Production database

## 8. Acceptance Criteria

- [ ] Users table with role column
- [ ] User registration (admin only)
- [ ] Role-based permissions
- [ ] User management page
- [ ] Posts show author info
- [ ] Database sync on deployment

---

⚠️ **需要批准后才能实现**
