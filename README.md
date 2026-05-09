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
