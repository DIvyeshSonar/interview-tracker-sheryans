export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function currentWeekLabel(date = new Date()) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function computeStats(questions) {
  const total = questions.length;
  const completed = questions.filter((q) => q.status === "Completed").length;
  const inProgress = questions.filter((q) => q.status === "In Progress").length;
  const dsaCompleted = questions.filter(
    (q) => q.category === "DSA" && q.status === "Completed"
  ).length;
  const interviewCompleted = questions.filter(
    (q) => q.category !== "DSA" && q.status === "Completed"
  ).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const byCategory = {
    DSA: questions.filter((q) => q.category === "DSA").length,
    Git: questions.filter((q) => q.category === "Git").length,
    Technical: questions.filter((q) => q.category === "Technical").length,
  };

  return {
    total,
    completed,
    inProgress,
    dsaCompleted,
    interviewCompleted,
    percent,
    byCategory,
  };
}

export function filterQuestions(questions, { query, category, status, difficulty }) {
  const q = query.trim().toLowerCase();
  return questions.filter((item) => {
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.notes || "").toLowerCase().includes(q);
    const matchesCategory = category === "All" || item.category === category;
    const matchesStatus = status === "All" || item.status === status;
    const matchesDifficulty = difficulty === "All" || item.difficulty === difficulty;
    return matchesQuery && matchesCategory && matchesStatus && matchesDifficulty;
  });
}

export function validateQuestion({ title, category, difficulty, status }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = "Give the question a title.";
  else if (title.trim().length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.trim().length > 120) errors.title = "Keep the title under 120 characters.";
  if (!category) errors.category = "Choose a category.";
  if (!difficulty) errors.difficulty = "Choose a difficulty.";
  if (!status) errors.status = "Choose a status.";
  return errors;
}

export function machineStatusTone(status) {
  if (status === "Completed") return "good";
  if (status === "In Progress") return "warn";
  return "idle";
}
