# 🗂️ TaskNest — React + Vite Frontend (Resume-Ready)

TaskNest is a polished, single-page task manager built with React, Vite, and Tailwind CSS. It’s designed as a professional, backend-free portfolio project: signup/login and task CRUD run entirely in the browser using localStorage, so it works anywhere without servers or databases.

## 🌟 Features

- 📝 Task management: add, edit, delete, complete, and filter
- 🏷️ Categories: Work, Personal, Shopping, Health, Other
- 🔍 Filtering: by category and status
- 📊 Stats: total, completed, pending
- 🔔 Optional reminders: browser notification helpers
- 🌙 Dark mode: persistent theme toggle
- ⚡ Fast build toolchain: React + Vite + Tailwind CSS

## 🛠️ Tech Stack

- Frontend: React 18, Vite, Tailwind CSS
- State/Context: React Context API
- Notifications: Browser Notifications API (optional)
- Storage: localStorage (no backend)

## 📁 Structure

```
TaskNest/
└── client/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/        # mockAuth.js, mockTasks.js, reminderService.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Install & Run
```bash
cd client
npm install
npm run dev
```
App runs at http://localhost:3000

### Build & Preview
```bash
npm run build
npm run preview
```

## 🧪 How It Works (Frontend-only)

- Auth: `utils/mockAuth.js` stores users in `localStorage` and simulates login/signup.
- Tasks: `utils/mockTasks.js` stores per-user tasks in `localStorage` with IDs and timestamps.
- No network calls: all components use local services; axios and API proxies are removed.

## 🌐 Deploy

You can deploy the `client/dist` folder to any static host (Vercel, Netlify, GitHub Pages):

1. `npm run build`
2. Deploy the generated `dist/` directory

Netlify/Vercel auto-detects Vite apps — just point to the `client` folder.

## 📝 Notes for Reviewers

- This is a frontend demo — localStorage is used instead of a backend. In production, replace `mockAuth`/`mockTasks` with real APIs.
- Notifications require permission and may be blocked by the browser.

## 🧭 Roadmap

- [ ] Drag-and-drop task ordering
- [ ] Priority and due dates
- [ ] Simple charts (completion rate)
- [ ] PWA support for offline use

---

Built with ❤️ using React + Vite
