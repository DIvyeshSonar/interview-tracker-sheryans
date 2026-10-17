import { Link } from "react-router-dom";
import { STATUSES } from "../constants";
import { formatDate } from "../utils";

const categoryClass = { DSA: "dsa", Git: "git", Technical: "tech" };
const difficultyClass = { Easy: "easy", Medium: "medium", Hard: "hard" };
const statusClass = {
  Completed: "good",
  "In Progress": "warn",
  Pending: "idle",
};

export default function QuestionCard({ question, onStatus, onDelete }) {
  return (
    <article className="card">
      <div>
        <h3>{question.title}</h3>
        <div className="meta">
          <span className={`tone ${categoryClass[question.category]}`}>{question.category}</span>
          <span className={`tone ${difficultyClass[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className={`tone ${statusClass[question.status]}`}>{question.status}</span>
        </div>
        {question.notes ? <p className="notes">{question.notes}</p> : null}
        <p className="notes">Updated {formatDate(question.updatedAt)}</p>
      </div>
      <div className="card-actions">
        <label className="sr-only" htmlFor={`status-${question.id}`}>
          Change status
        </label>
        <select
          id={`status-${question.id}`}
          value={question.status}
          onChange={(e) => onStatus(question.id, e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="btn-row">
          <Link to={`/questions/${question.id}/edit`} className="btn btn-ghost">
            Edit
          </Link>
          <button className="btn btn-danger" type="button" onClick={() => onDelete(question.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
