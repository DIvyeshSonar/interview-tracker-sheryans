export const STORAGE_KEYS = {
  questions: "ipt.questions.v1",
  machineCoding: "ipt.machineCoding.v1",
};

export const CATEGORIES = [
  { id: "DSA", label: "DSA", hint: "Data structures & algorithms" },
  { id: "Git", label: "Git", hint: "Version control & workflows" },
  { id: "Technical", label: "Technical", hint: "System design & CS fundamentals" },
];

export const DIFFICULTIES = [
  { id: "Easy", label: "Easy" },
  { id: "Medium", label: "Medium" },
  { id: "Hard", label: "Hard" },
];

export const STATUSES = [
  { id: "Pending", label: "Pending" },
  { id: "In Progress", label: "In Progress" },
  { id: "Completed", label: "Completed" },
];

export const MACHINE_STATUSES = [
  { id: "Not started", label: "Not started" },
  { id: "In Progress", label: "In Progress" },
  { id: "Completed", label: "Completed" },
];

export const SAMPLE_QUESTIONS = [
  {
    title: "Two Sum",
    category: "DSA",
    difficulty: "Easy",
    status: "Completed",
    notes: "Hash map in one pass. Review edge cases with duplicates.",
  },
  {
    title: "Merge Intervals",
    category: "DSA",
    difficulty: "Medium",
    status: "In Progress",
    notes: "Sort by start time, then fold overlapping ranges.",
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    category: "DSA",
    difficulty: "Hard",
    status: "Pending",
    notes: "BFS with null markers is the interview-friendly approach.",
  },
  {
    title: "Explain rebase vs merge",
    category: "Git",
    difficulty: "Easy",
    status: "Completed",
    notes: "Rebase rewrites history; merge preserves it. Never rebase shared main.",
  },
  {
    title: "Recover from a detached HEAD",
    category: "Git",
    difficulty: "Medium",
    status: "Pending",
    notes: "Create a branch from HEAD, then checkout the intended branch.",
  },
  {
    title: "REST vs GraphQL trade-offs",
    category: "Technical",
    difficulty: "Medium",
    status: "In Progress",
    notes: "Over-fetching, caching, schema evolution, and team ownership.",
  },
  {
    title: "Design a URL shortener",
    category: "Technical",
    difficulty: "Hard",
    status: "Pending",
    notes: "ID generation, redirects, analytics, and collision handling.",
  },
];

export const SAMPLE_MACHINE = {
  title: "Build a Kanban board with drag-and-drop and local persistence",
  status: "In Progress",
  notes: "Focus on state model, keyboard accessibility, and empty columns.",
  updatedAt: null,
};
