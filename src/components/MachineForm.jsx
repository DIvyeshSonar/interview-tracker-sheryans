import { useEffect, useState } from "react";
import { MACHINE_STATUSES } from "../constants";
import { machineStatusTone } from "../utils";

export default function MachineForm({ machine, onSave }) {
  const [draft, setDraft] = useState(() => ({
    title: machine.title || "",
    status: machine.status || "Not started",
    notes: machine.notes || "",
  }));
  const [errors, setErrors] = useState({});
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setDraft({
      title: machine.title || "",
      status: machine.status || "Not started",
      notes: machine.notes || "",
    });
  }, [machine.title, machine.status, machine.notes, machine.updatedAt]);

  useEffect(() => {
    if (!savedFlash) return undefined;
    const timer = window.setTimeout(() => setSavedFlash(false), 2200);
    return () => window.clearTimeout(timer);
  }, [savedFlash]);

  function set(key) {
    return (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!draft.title.trim()) nextErrors.title = "Name this week’s machine-coding problem.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSave({
      title: draft.title.trim(),
      status: draft.status,
      notes: draft.notes.trim(),
    });
    setSavedFlash(true);
  }

  function reset() {
    setDraft({
      title: machine.title || "",
      status: machine.status || "Not started",
      notes: machine.notes || "",
    });
    setErrors({});
    setSavedFlash(false);
  }

  return (
    <form
      className={`panel panel-pad machine-form${savedFlash ? " is-saved" : ""}`}
      onSubmit={submit}
      noValidate
    >
      <p className="kicker">Machine coding</p>
      <h2>This week’s build</h2>
      <p className="lede">
        Keep one focused implementation problem alongside DSA and theory. Status shows on the
        dashboard.
      </p>
      <div className="field">
        <label htmlFor="mc-title">Problem *</label>
        <input
          id="mc-title"
          value={draft.title}
          onChange={set("title")}
          placeholder="e.g. Autocomplete search with debounce"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="mc-status">Status</label>
          <select id="mc-status" value={draft.status} onChange={set("status")}>
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
            <span className={`tone machine-state ${machineStatusTone(draft.status)}`}>
              {draft.status}
            </span>
          </div>
        </div>
      </div>
      <div className="field">
        <label htmlFor="mc-notes">Implementation notes</label>
        <textarea
          id="mc-notes"
          value={draft.notes}
          onChange={set("notes")}
          placeholder="Constraints, APIs, or what you still need to ship."
        />
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" type="submit">
          Save machine-coding plan
        </button>
        <button className="btn btn-ghost" type="button" onClick={reset}>
          Reset
        </button>
      </div>
      {savedFlash ? (
        <p className="save-toast" role="status">
          <span className="save-check" aria-hidden="true">✓</span>
          Machine-coding plan saved.
        </p>
      ) : null}
      {!savedFlash && machine.updatedAt ? (
        <p className="save-meta">Last saved {new Date(machine.updatedAt).toLocaleString("en-IN")}</p>
      ) : null}
    </form>
  );
}
