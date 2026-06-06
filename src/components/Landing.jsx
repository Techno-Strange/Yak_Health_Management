import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="grid-two">
      <div>
        <h2>Yak Health Management</h2>
        <p>
          Prototype dashboard for managing yak records — vaccination history,
          check-ups, and notes.
        </p>
        <div>
          <Link to="/search" className="btn btn-primary">Open Portal</Link>
          <button className="btn btn-secondary" style={{ marginLeft: "10px" }}>
            Documentation
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Quick Stats</h3>
        <div className="grid-three">
          <div className="card">
            <div>Total Yaks</div>
            <div className="stat">128</div>
          </div>
          <div className="card">
            <div>Vaccinated (6mo)</div>
            <div className="stat">98</div>
          </div>
          <div className="card">
            <div>Needs Follow-up</div>
            <div className="stat">6</div>
          </div>
        </div>
      </div>
    </div>
  );
}
