# MERN Monorepo Setup Guide

This project uses:

* **pnpm workspaces**
* Monorepo structure
* React (Vite) frontend
* Express backend

Please follow the steps exactly to avoid dependency issues.

---

# 📦 Prerequisites

Make sure you have installed:

* Node.js (v18+ recommended)
* pnpm

If you don’t have pnpm:

```bash
npm install -g pnpm
```

Verify:

```bash
pnpm -v
node -v
```

---

# 📥 After Cloning / Pulling

From the **root directory** of the project:

```bash
pnpm install
```

Do NOT run install inside `frontend` or `backend`.
Install only from the root. The workspace handles everything.

---

# 🚀 Running the Project

From the root:

```bash
pnpm dev
```

This starts:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:5000](http://localhost:5000)

Both run in parallel automatically.

---

# 🗂 Project Structure

```
mern-monorepo/
│
├── apps/
│   ├── frontend/   # React (Vite)
│   └── backend/    # Express server
│
├── packages/       # Shared code (if used later)
│
├── pnpm-workspace.yaml
└── package.json
```

---

# ⚠️ Important Rules

* Do NOT use npm or yarn.
* Always use pnpm.
* Do NOT commit node_modules.
* Run installs only from the root.

---

# 🛠 Adding a Dependency

To add a package to backend:

```bash
pnpm add <package-name> --filter backend
```

To add to frontend:

```bash
pnpm add <package-name> --filter frontend
```

Example:

```bash
pnpm add axios --filter frontend
```

---

# 🧹 If Something Breaks

Try:

```bash
rm -rf node_modules
rm -rf apps/*/node_modules
pnpm install
```

Then run:

```bash
pnpm dev
```

---

# 🔄 Pulling Updates

After pulling new changes:

```bash
pnpm install
```

Always reinstall if package.json changes.

---

That’s it.
Simple, consistent, no chaos.

