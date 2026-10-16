# Interview Practice Tracker

A responsive dashboard for tracking weekly interview preparation: DSA problems, Git questions, technical interview prompts, and one machine-coding build.

## Features

- **Dashboard** — total questions, completed DSA problems, completed interview questions (Git + Technical), and machine-coding status
- **Question tracker** — add, edit, delete, and update status (`Pending` / `In Progress` / `Completed`) with category (`DSA` / `Git` / `Technical`) and difficulty
- **Search and filters** — filter by category, status, and difficulty; search titles and notes
- **Progress** — completion percentage from stored questions, plus category mix bars
- **Machine coding** — one weekly implementation problem with its own status, shown on the dashboard
- **Persistence** — LocalStorage; data survives refresh
- **States** — empty queue, no search results, and form validation
- **Responsive** — desktop and mobile layouts

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Assumptions

- “Completed interview questions” counts Git and Technical items marked Completed. DSA has its own completed counter.
- Machine coding is a single weekly problem, not a list of questions.
- All data is local to the browser; there is no account or backend.
- “Load sample week” overwrites the current question list and machine-coding plan so the dashboard can be demoed quickly.

## Tech

React 18 + Vite. No UI library.
