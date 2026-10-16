import { useMemo, useState } from "react";
import ProgressRing from "./components/ProgressRing.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import QuestionForm from "./components/QuestionForm.jsx";
import {
  CATEGORIES,
  DIFFICULTIES,
  MACHINE_STATUSES,
  SAMPLE_MACHINE,
  SAMPLE_QUESTIONS,
  STATUSES,
  STORAGE_KEYS,
} from "./constants";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  computeStats,
  currentWeekLabel,
  filterQuestions,
  machineStatusTone,
  uid,
} from "./utils";

export default function App() {
  const [questions, setQuestions] = useLocalStorage(STORAGE_KEYS.questions, []);
  const [machine, setMachine] = useLocalStorage(STORAGE_KEYS.machineCoding, {
    title: "",
    status: "Not started",
    notes: "",
    updatedAt: null,
  });
  const [filters, setFilters] = useState({
    query: "",
    category: "All",
    status: "All",
    difficulty: "All",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [machineErrors, setMachineErrors] = useState({});

  const stats = useMemo(() => computeStats(questions), [questions]);
  const visible = useMemo(
    () =>
      filterQuestions(questions, filters).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      ),
    [questions, filters]
  );

  const hasActiveFilters =
    filters.query.trim() ||
    filters.category !== "All" ||
    filters.status !== "All" ||
    filters.difficulty !== "All";

  function saveQuestion(payload) {
    const now = new Date().toISOString();
    if (editing?.id) {
      setQuestions((list) =>
        list.map((q) => (q.id === editing.id ? { ...q, ...payload, updatedAt: now } : q))
      );
    } else {
      setQuestions((list) => [{ id: uid(), createdAt: now, updatedAt: now, ...payload }, ...list]);
    }
    setFormOpen(false);
    setEditing(null);
  }

  function deleteQuestion(id) {
    const item = questions.find((q) => q.id === id);
    if (!item) return;
    if (!window.confirm(`Remove “${item.title}”? This cannot be undone.`)) return;
    setQuestions((list) => list.filter((q) => q.id !== id));
  }

  function loadSamples() {
    const now = new Date().toISOString();
    setQuestions(
      SAMPLE_QUESTIONS.map((q) => ({
        ...q,
        id: uid(),
        createdAt: now,
        updatedAt: now,
      }))
    );
    setMachine({ ...SAMPLE_MACHINE, updatedAt: now });
  }

  function saveMachine(e) {
    e.preventDefault();
    const errors = {};
    if (!machine.title.trim()) errors.title = "Name this week’s machine-coding problem.";
    setMachineErrors(errors);
    if (Object.keys(errors).length) return;
    setMachine((m) => ({ ...m, title: m.title.trim(), notes: m.notes.trim(), updatedAt: new Date().toISOString() }));
  }

  const maxCat = Math.max(1, stats.total);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="mark" aria-hidden="true">
            IP
          </div>
          <div>
            <p className="eyebrow">Weekly prep desk</p>
            <h1>Interview Practice Tracker</h1>
            <div className="week-chip">
              <span className="dot" />
              This week · {currentWeekLabel()}
            </div>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" type="button" onClick={loadSamples}>
            Load sample week
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add question
          </button>
        </div>
      </header>

      <section className="hero-grid">
        <div className="stats">
          <article className="stat">
            <span>Total questions</span>
            <strong>{stats.total}</strong>
            <em>{stats.inProgress} currently in progress</em>
          </article>
          <article className="stat">
            <span>Completed DSA</span>
            <strong>{stats.dsaCompleted}</strong>
            <em>{stats.byCategory.DSA} DSA items logged</em>
          </article>
          <article className="stat">
            <span>Completed interviews</span>
            <strong>{stats.interviewCompleted}</strong>
            <em>Git + technical questions closed</em>
          </article>
          <article className="stat">
            <span>Machine coding</span>
            <strong style={{ fontSize: "1.15rem", marginTop: 14 }}>{machine.status}</strong>
            <em>{machine.title ? machine.title : "No problem set for this week"}</em>
          </article>
        </div>

        <aside className="panel panel-pad progress-panel">
          <ProgressRing percent={stats.percent} />
          <div className="progress-copy">
            <h2>Completion this week</h2>
            <p>
              {stats.total === 0
                ? "Add questions to start measuring progress. Percentage is completed ÷ total stored questions."
                : `${stats.completed} of ${stats.total} questions marked completed.`}
            </p>
            <div className="bars">
              {[
                ["DSA", stats.byCategory.DSA, "dsa"],
                ["Git", stats.byCategory.Git, "git"],
                ["Technical", stats.byCategory.Technical, "tech"],
              ].map(([label, count, cls]) => (
                <div className="bar-row" key={label}>
                  <span>{label}</span>
                  <div className="track">
                    <div className={`fill ${cls}`} style={{ width: `${(count / maxCat) * 100}%` }} />
                  </div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="machine">
        <form className="panel panel-pad" onSubmit={saveMachine} noValidate>
          <p className="kicker">Machine coding</p>
          <h2>This week’s build</h2>
          <p className="lede">
            Keep one focused implementation problem alongside DSA and theory. Status shows on the dashboard.
          </p>
          <div className="field">
            <label htmlFor="mc-title">Problem *</label>
            <input
              id="mc-title"
              value={machine.title}
              onChange={(e) => setMachine((m) => ({ ...m, title: e.target.value }))}
              placeholder="e.g. Autocomplete search with debounce"
            />
            {machineErrors.title && <span className="error">{machineErrors.title}</span>}
          </div>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="mc-status">Status</label>
              <select
                id="mc-status"
                value={machine.status}
                onChange={(e) =>
                  setMachine((m) => ({
                    ...m,
                    status: e.target.value,
                    updatedAt: new Date().toISOString(),
                  }))
                }
              >
                {MACHINE_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Current state</label>
              <div>
                <span className={`tone ${machineStatusTone(machine.status)}`}>{machine.status}</span>
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="mc-notes">Implementation notes</label>
            <textarea
              id="mc-notes"
              value={machine.notes}
              onChange={(e) => setMachine((m) => ({ ...m, notes: e.target.value }))}
              placeholder="Constraints, APIs, or what you still need to ship."
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Save machine-coding plan
          </button>
        </form>

        <div className="panel panel-pad">
          <p className="kicker">How to use this desk</p>
          <h2>A realistic weekly loop</h2>
          <p className="lede">
            Log every problem you intend to finish. Move status as you work. Completion percentage and category bars
            update from LocalStorage, so a refresh does not wipe the week.
          </p>
          <p className="lede">
            Interview questions here are Git and Technical items. DSA stays in its own completed count, matching how
            most prep plans split “problems” from “interview questions.”
          </p>
        </div>
      </section>

      <div className="list-head">
        <div>
          <p className="kicker">Question tracker</p>
          <h2>Work queue</h2>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add question
        </button>
      </div>

      <div className="filters">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Search titles and notes"
            aria-label="Search questions"
          />
        </div>
        <select
          aria-label="Filter by category"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by difficulty"
          value={filters.difficulty}
          onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
        >
          <option value="All">All difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {questions.length === 0 ? (
        <div className="empty">
          <h3>No questions this week</h3>
          <p>Start a queue, or load a realistic sample week to see the dashboard in motion.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary" type="button" onClick={() => setFormOpen(true)}>
              Add your first question
            </button>
            <button className="btn btn-ghost" type="button" onClick={loadSamples}>
              Load sample week
            </button>
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <h3>No matching questions</h3>
          <p>Nothing fits that search and filter combination. Broaden the filters or try another keyword.</p>
          {hasActiveFilters && (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() =>
                setFilters({ query: "", category: "All", status: "All", difficulty: "All" })
              }
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="cards">
          {visible.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onStatus={(id, status) =>
                setQuestions((list) =>
                  list.map((item) =>
                    item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
                  )
                )
              }
              onEdit={(item) => {
                setEditing(item);
                setFormOpen(true);
              }}
              onDelete={deleteQuestion}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <QuestionForm
          initial={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSave={saveQuestion}
        />
      )}

      <p className="footer-note">
        Data stays in this browser via LocalStorage. Clearing site data will reset the tracker.
      </p>

      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </div>
  );
}
