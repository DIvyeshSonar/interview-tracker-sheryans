import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, DIFFICULTIES, STATUSES } from "../constants";
import { validateQuestion } from "../utils";

const empty = {
  title: "",
  category: "DSA",
  difficulty: "Medium",
  status: "Pending",
  notes: "",
};

function toForm(question) {
  if (!question) return empty;
  return {
    title: question.title,
    category: question.category,
    difficulty: question.difficulty,
    status: question.status,
    notes: question.notes || "",
  };
}

export default function QuestionFormPage({ questions, onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = useMemo(
    () => (id ? questions.find((q) => q.id === id) : null),
    [id, questions]
  );

  const [form, setForm] = useState(() => toForm(existing));
  const [errors, setErrors] = useState({});
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setForm(toForm(existing));
    setErrors({});
    setSavedFlash(false);
  }, [id, existing]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (id && !existing) {
    return (
      <div className="empty">
        <h3>Question not found</h3>
        <p>That item may have been deleted, or the link is out of date.</p>
        <Link to="/questions" className="btn btn-primary">
          Back to work queue
        </Link>
      </div>
    );
  }

  function submit(e) {
    e.preventDefault();
    const nextErrors = validateQuestion(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSave(
      {
        title: form.title.trim(),
        category: form.category,
        difficulty: form.difficulty,
        status: form.status,
        notes: form.notes.trim(),
      },
      existing?.id
    );
    setSavedFlash(true);
    window.setTimeout(() => navigate("/questions"), 650);
  }

  return (
    <section className="form-page">
      <div className="list-head">
        <div>
          <p className="kicker">Question tracker</p>
          <h2>{existing ? "Edit question" : "Add a question"}</h2>
        </div>
        <Link to="/questions" className="btn btn-ghost">
          Back to queue
        </Link>
      </div>

      <form className="panel panel-pad form-panel" onSubmit={submit} noValidate>
        <p className="lede">
          Track DSA, Git, and technical prompts for this week. Required fields are marked.
        </p>

        <div className="field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Lowest Common Ancestor"
            autoFocus
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="grid-2">
          <div className="field">
            <label htmlFor="category">Category *</label>
            <select id="category" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty *</label>
            <select id="difficulty" value={form.difficulty} onChange={set("difficulty")}>
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="status">Status *</label>
          <select id="status" value={form.status} onChange={set("status")}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={set("notes")}
            placeholder="Approach, pitfalls, or a follow-up to revisit."
          />
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" type="submit">
            {existing ? "Save changes" : "Add question"}
          </button>
          <Link to="/questions" className="btn btn-ghost">
            Cancel
          </Link>
        </div>

        {savedFlash ? (
          <p className="save-toast" role="status">
            Saved — opening work queue…
          </p>
        ) : null}
      </form>
    </section>
  );
}
