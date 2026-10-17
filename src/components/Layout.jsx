import { NavLink } from "react-router-dom";
import { currentWeekLabel } from "../utils";

export default function Layout({ children, onLoadSamples }) {
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
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Dashboard
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Questions
            </NavLink>
          </nav>
          <button className="btn btn-ghost" type="button" onClick={onLoadSamples}>
            Load sample week
          </button>
          <NavLink to="/questions/new" className="btn btn-primary">
            Add question
          </NavLink>
        </div>
      </header>

      {children}

      <p className="footer-note">
        Data stays in this browser via LocalStorage. Clearing site data will reset the tracker.
      </p>
    </div>
  );
}
