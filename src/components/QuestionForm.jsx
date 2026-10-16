import { useEffect, useState } from "react";
import { CATEGORIES, DIFFICULTIES, STATUSES } from "../constants";
import { validateQuestion } from "../utils";

const empty = {
  title: "",
  category: "DSA",
  difficulty: "Medium",
  status: "Pending",
  notes: "",
};

export default function QuestionForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    const nextErrors = validateQuestion(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
      >
        <h2>{initial?.id ? "Edit question" : "Add a question"}</h2>
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
            {initial?.id ? "Save changes" : "Add question"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
