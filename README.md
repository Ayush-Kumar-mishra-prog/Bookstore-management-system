# Bookstore Management System

Full-stack MERN bookstore application with only two roles:

- Customer: browse books, add to cart, checkout, and view orders.
- Admin: manage books, inventory, and customer order status.

## Stack

- Frontend: React, React Router, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt

## Setup

Packages are not installed by this change. See `package.md` for the exact packages to install later.

1. Install frontend packages in `frontend`.
2. Install backend packages in `backend`.
3. Copy `backend/.env.example` to `backend/.env` and update values.
4. Start MongoDB.
5. Create an admin user with the backend script listed in `package.md`.
6. Run the backend API and frontend dev server.

Default API base used by the frontend:

```text
http://localhost:5000/api
```

To change it, set `VITE_API_BASE_URL` in the frontend environment.
