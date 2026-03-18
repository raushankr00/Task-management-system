# TaskFlow — Task Management System

A full-stack Task Management System built as a software engineering assessment. Users can register, log in, and perform complete CRUD operations on their personal tasks.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (Access + Refresh Tokens), bcrypt |
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with token refresh interceptor) |

---

## Project Structure

```
task-management/
├── backend/               # Node.js + Express API
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── src/
│       ├── controllers/   # Route handler logic
│       ├── middleware/     # Auth, validation
│       ├── routes/        # Express routers
│       ├── types/         # TypeScript interfaces
│       ├── utils/         # JWT helpers, response utils
│       └── index.ts       # Entry point
│
└── frontend/              # Next.js App
    └── src/
        ├── app/
        │   ├── auth/      # Login & Register pages
        │   └── dashboard/ # Main task dashboard
        ├── components/
        │   └── tasks/     # TaskCard, TaskForm, TaskFilters
        ├── hooks/         # useAuth, useTasks
        ├── lib/           # API client, services, utils
        └── types/         # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=your-strong-secret-here
JWT_REFRESH_SECRET=your-other-strong-secret-here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

```bash
# Generate Prisma client and push schema to DB
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and receive tokens |
| POST | `/auth/refresh` | ❌ | Refresh access token |
| POST | `/auth/logout` | ✅ | Invalidate refresh token |
| GET | `/auth/me` | ✅ | Get current user |

#### Register
```json
POST /api/auth/register
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

#### Refresh Token
```json
POST /api/auth/refresh
{
  "refreshToken": "<refresh_token>"
}
```

---

### Tasks — `/api/tasks`

All task endpoints require `Authorization: Bearer <access_token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (paginated, filterable, searchable) |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/:id` | Get a single task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/toggle` | Cycle task status |

#### GET /tasks — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 50) |
| `status` | string | Filter by: `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `priority` | string | Filter by: `LOW`, `MEDIUM`, `HIGH` |
| `search` | string | Search by title or description |
| `sortBy` | string | Sort field (default: `createdAt`) |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

#### Create Task
```json
POST /api/tasks
{
  "title": "Build the backend API",
  "description": "Complete all required endpoints",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-03-21"
}
```

#### Task Status Values
- `PENDING` → `IN_PROGRESS` → `COMPLETED` (cycles via toggle)

---

## Security Features

- **Password hashing** — bcrypt with 12 salt rounds
- **JWT tokens** — Short-lived access token (15m) + long-lived refresh token (7d)
- **Refresh token rotation** — Old token invalidated on each refresh
- **Rate limiting** — 10 auth attempts / 100 API requests per 15 min window
- **Helmet** — Secure HTTP headers
- **CORS** — Restricted to configured origin
- **Input validation** — express-validator on all endpoints
- **Ownership checks** — Users can only access their own tasks

---

## Frontend Features

- ✅ Login & Registration pages with validation
- ✅ Automatic token refresh via Axios interceptor
- ✅ Task dashboard with stats overview
- ✅ Create, Edit, Delete tasks via modal form
- ✅ Toggle task status (Pending → In Progress → Completed)
- ✅ Search by title/description (debounced)
- ✅ Filter by status and priority
- ✅ Pagination with page controls
- ✅ Toast notifications for all operations
- ✅ Loading skeletons
- ✅ Fully responsive (mobile + desktop)
- ✅ Overdue task highlighting

---

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## Environment Variables Reference

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Prisma DB connection string | `file:./dev.db` |
| `PORT` | API server port | `5000` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | *(required)* |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | *(required)* |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Author

Built for Earnest Data Analytics Recruitment Drive — March 2026.
