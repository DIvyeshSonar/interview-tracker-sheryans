import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard.jsx";
import { CATEGORIES, DIFFICULTIES, STATUSES } from "../constants";
import { filterQuestions } from "../utils";

export default function Questions({ questions, onStatus, onDelete, onLoadSamples }) {
  const [filters, setFilters] = useState({
    query: "",
    category: "All",
    status: "All",
    difficulty: "All",
  });

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

  return (
    <>
      <div className="list-head">
        <div>
          <p className="kicker">Question tracker</p>
          <h2>Work queue</h2>
        </div>
        <Link to="/questions/new" className="btn btn-primary">
          Add question
        </Link>
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
            <Link to="/questions/new" className="btn btn-primary">
              Add your first question
            </Link>
            <button className="btn btn-ghost" type="button" onClick={onLoadSamples}>
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
              onStatus={onStatus}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
