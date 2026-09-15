# Packages To Install Later

No packages were installed during this cleanup.

## Frontend

Run from `frontend`:

```bash
npm install react react-dom react-router-dom react-hot-toast lucide-react
npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer
```

## Backend

Run from `backend`:

```bash
npm install express mongoose cors dotenv jsonwebtoken bcryptjs morgan
npm install -D nodemon
```

The backend `package.json` already includes these scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "create-admin": "node src/scripts/createAdmin.js"
  }
}
```
