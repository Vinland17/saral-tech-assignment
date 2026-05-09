# 📝 Secure Todo App — Saral Tech Assignment

A full-stack, secure Todo application built with **Next.js 16** (Frontend) and **Strapi v5** (Backend/CMS). Users can register, log in, and manage their own private list of tasks. The application ensures complete data isolation — each user can only see and manage their own todos.

---

## 🌐 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS + Inline Styles |
| State Management | React Context API |
| Backend / CMS | Strapi v5 (Headless CMS) |
| Database | SQLite (via Strapi default) |
| Authentication | JWT (JSON Web Tokens) |
| HTTP Client | Axios + Native Fetch |
| Cookie Management | js-cookie |

---

## ✅ Features

### Authentication
- **Sign Up** — Register with username, email, and password
  - Email format validation
  - Minimum 6-character password enforcement
- **Sign In** — Login with email/username and password
  - JWT token stored securely in cookies
  - Redirects to dashboard on success
- **Logout** — Clears session and redirects to sign in

### Todo Management
- **Create** — Add new tasks instantly
- **Read** — View only your own tasks (server-enforced)
- **Update** — Toggle tasks between Pending and Completed
- **Delete** — Permanently remove tasks
- **Filter** — Filter todos by All / Pending / Completed
- **Stats** — Live count of total, pending, and completed tasks

### Route Protection
- `/dashboard` is protected — redirects unauthenticated users to `/signin`
- `/signin` and `/signup` redirect authenticated users to `/dashboard`
- Protection handled via Next.js 16 Proxy (middleware)

### Security (Bonus)
- Backend Strapi controller assigns the user from JWT (`ctx.state.user`) — the frontend cannot spoof ownership
- Todos are fetched via a direct link table query — users can never access another user's data even by manipulating API calls

---

## 📁 Project Structure

todo-app/
├── backend/                      # Strapi v5 CMS
│   ├── src/
│   │   └── api/
│   │       └── todo/
│   │           └── controllers/
│   │               └── todo.ts   # Custom controller (security logic)
│   ├── config/
│   │   └── middlewares.ts        # CORS configuration
│   └── .tmp/
│       └── data.db               # SQLite database (auto-generated)
│
└── frontend/                     # Next.js 16 App
├── app/
│   ├── layout.js             # Root layout with AuthProvider
│   ├── page.js               # Root redirect
│   ├── signin/
│   │   └── page.js           # Sign In page
│   ├── signup/
│   │   └── page.js           # Sign Up page
│   └── dashboard/
│       └── page.js           # Protected Dashboard
├── context/
│   └── AuthContext.js        # Global auth state (React Context)
├── lib/
│   └── api.js                # All API calls (separated from UI)
└── proxy.js                  # Route protection (Next.js 16 Proxy)

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have the following installed:
- **Node.js** v18 or higher
- **npm** v8 or higher
- **Git**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vinland17/saral-tech-assignment.git
cd saral-tech-assignment
```

---

### Step 2: Setup & Run the Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

- Strapi will start on `http://localhost:1337`
- The admin panel will open at `http://localhost:1337/admin`
- **First time only:** Register an admin account when prompted

#### Configure Strapi (First Time Only)

1. **Create Content Type:**
   - Go to Content-Type Builder → Create Collection Type → Name: `Todo`
   - Add field: `title` (Short Text, Required)
   - Add field: `isCompleted` (Boolean, Default: false)
   - Add relation: User (users-permissions) has many Todos
   - Click Save

2. **Set Permissions:**
   - Go to Settings → Roles → Authenticated
   - Under Todo: check `find`, `findOne`, `create`, `update`, `delete`
   - Click Save

---

### Step 3: Setup & Run the Frontend (Next.js)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

- Frontend will start on `http://localhost:3000`

---

### Step 4: Use the App

1. Open `http://localhost:3000` in your browser
2. Click **Sign Up** to create a new account
3. Log in with your credentials
4. Start adding, completing, and deleting todos!

> ⚠️ Both servers must be running simultaneously — Strapi on port **1337** and Next.js on port **3000**

---

## 🔐 API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/local/register` | Register new user |
| POST | `/api/auth/local` | Login and get JWT |
| GET | `/api/todos?populate=*` | Get current user's todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:documentId` | Toggle todo status |
| DELETE | `/api/todos/:documentId` | Delete a todo |

---

## 🎨 UI Design

- Dark modern theme (`#0f0f13` background)
- Yellow accent color (`#f5c518`) for primary actions
- Responsive layout (mobile friendly)
- Loading spinners, error messages, empty states
- Color-coded badges (Pending = orange, Done = green)

---

## 🏆 Bonus Features Implemented

- ✅ **Strict Backend Policy** — Strapi controller assigns user from JWT, prevents data spoofing
- ✅ **Route Protection** — Next.js 16 Proxy protects all routes
- ✅ **Modular Code** — All API calls separated into `lib/api.js`
- ✅ **UX Polish** — Loading states, error handling, filter tabs, stats cards

---

## 👨‍💻 Author

**Vinland17**
GitHub: [@Vinland17](https://github.com/Vinland17)

---

## 📄 License

This project was built as part of a technical assignment for Saral Tech.
