import { Link } from "react-router-dom";
import MachineForm from "../components/MachineForm.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import { computeStats } from "../utils";

export default function Dashboard({ questions, machine, onSaveMachine }) {
  const stats = computeStats(questions);
  const maxCat = Math.max(1, stats.total);

  return (
    <>
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
        <MachineForm machine={machine} onSave={onSaveMachine} />

        <div className="panel panel-pad">
          <p className="kicker">How to use this desk</p>
          <h2>A realistic weekly loop</h2>
          <p className="lede">
            Keep the dashboard for progress and this week’s build. Manage the full work queue on its
            own page so this view stays focused.
          </p>
          <p className="lede">
            Interview questions here are Git and Technical items. DSA stays in its own completed
            count, matching how most prep plans split “problems” from “interview questions.”
          </p>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <Link to="/questions" className="btn btn-primary">
              Open work queue
            </Link>
            <Link to="/questions/new" className="btn btn-ghost">
              Add question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
