import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuizStorage } from "../hooks/useQuizStorage";
import { getStats } from "../utils/storage";
import { getBestCategory, getWorstCategory, getScoreTrend, formatDate, getGrade, getDifficultyColor } from "../utils/stats";
import ScoreBar from "../components/ScoreBar";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const { sessions, clearAll } = useQuizStorage();
  const [confirmClear, setConfirmClear] = useState(false);

  const stats = getStats();
  const bestCat = getBestCategory(stats.categoryStats);
  const worstCat = getWorstCategory(stats.categoryStats);
  const trend = getScoreTrend(sessions, 10);
  const categoryEntries = Object.values(stats.categoryStats);

  if (!sessions.length) {
    return (
      <div className="page page-enter">
        <div className="container">
          <div className="dash-empty text-center">
            
            <h2>No Quiz History Yet</h2>
            <p className="mt-1">Complete a quiz and save your results to see your progress here.</p>
            <Link to="/setup" className="btn btn-primary btn-lg mt-3">
              ▶ &nbsp;Take Your First Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-enter">
      <div className="container">
        
        <div className="dash-header">
          <div>
            <div className="badge badge-accent mb-2">📊 Progress Dashboard</div>
            <h1>Your Learning Journey</h1>
            <p className="mt-1">{sessions.length} session{sessions.length !== 1 ? "s" : ""} tracked · Average score: <strong style={{ color: "var(--accent-light)" }}>{stats.averageScore}%</strong></p>
          </div>
          <div className="dash-header-actions">
            {!confirmClear ? (
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmClear(true)}>
                🗑 Clear History
              </button>
            ) : (
              <div className="confirm-clear card card-padding">
                <span>Are you sure?</span>
                <button className="btn btn-danger btn-sm" onClick={() => { clearAll(); setConfirmClear(false); }}>Yes, clear</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div className="dash-grid">
          
          <div className="dash-left">

            
            {categoryEntries.length > 0 && (
              <div className="card card-padding dash-section">
                <h2 className="dash-section-title">Category Performance</h2>
                <div className="bars-list">
                  {categoryEntries
                    .sort((a, b) => b.avgScore - a.avgScore)
                    .map((cat) => {
                      const color = cat.avgScore >= 70 ? "var(--green)" : cat.avgScore >= 50 ? "var(--yellow)" : "var(--red)";
                      return (
                        <ScoreBar
                          key={cat.name}
                          label={cat.name.replace(/^.*?: /, "")}
                          score={cat.avgScore}
                          color={color}
                          attempts={cat.attempts}
                        />
                      );
                    })}
                </div>
              </div>
            )}

            {/* Strongest / Weakest */}
            <div className="grid-2">
              {bestCat && (
                <div className="card card-padding insight-card insight-card--best">
                  
                  <div className="insight-label">Strongest</div>
                  <div className="insight-cat">{bestCat.name.replace(/^.*?: /, "")}</div>
                  <div className="insight-score" style={{ color: "var(--green)" }}>{bestCat.avgScore}%</div>
                </div>
              )}
              {worstCat && worstCat.name !== bestCat?.name && (
                <div className="card card-padding insight-card insight-card--worst">
                  
                  <div className="insight-label">Needs Work</div>
                  <div className="insight-cat">{worstCat.name.replace(/^.*?: /, "")}</div>
                  <div className="insight-score" style={{ color: "var(--red)" }}>{worstCat.avgScore}%</div>
                </div>
              )}
            </div>

            {/* Score Trend */}
            {trend.length > 1 && (
              <div className="card card-padding dash-section">
                <h2 className="dash-section-title">Score Trend</h2>
                <p className="dash-section-sub">Last {trend.length} quizzes</p>
                <div className="trend-chart">
                  {trend.map((item, i) => {
                    const color = item.score >= 70 ? "var(--green)" : item.score >= 50 ? "var(--yellow)" : "var(--red)";
                    return (
                      <div key={item.id} className="trend-bar-col">
                        <div className="trend-score-label" style={{ color }}>{item.score}%</div>
                        <div className="trend-bar-track">
                          <div
                            className="trend-bar-fill"
                            style={{
                              height: `${item.score}%`,
                              background: `linear-gradient(180deg, ${color}, ${color}88)`,
                              boxShadow: `0 0 10px ${color}55`,
                              animationDelay: `${i * 0.06}s`,
                            }}
                          />
                        </div>
                        <div className="trend-date">{item.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Session History ── */}
          <div className="dash-right">
            <div className="card dash-section" style={{ padding: 0, overflow: "hidden" }}>
              <div className="history-header card-padding">
                <h2 className="dash-section-title" style={{ margin: 0 }}>Session History</h2>
                <span className="history-count">{sessions.length} sessions</span>
              </div>
              <div className="history-list">
                {sessions.map((s) => {
                  const grade = getGrade(s.score);
                  return (
                    <div key={s.id} className="history-row">
                      <div className="history-grade" style={{ color: grade.color }}>{grade.letter}</div>
                      <div className="history-main">
                        <div className="history-cat">{s.category.name.replace(/^.*?: /, "")}</div>
                        <div className="history-meta">
                          <span
                            className="badge"
                            style={{
                              color: getDifficultyColor(s.difficulty),
                              background: `${getDifficultyColor(s.difficulty)}18`,
                              border: `1px solid ${getDifficultyColor(s.difficulty)}44`,
                              padding: "0.15rem 0.5rem",
                              fontSize: "0.72rem",
                            }}
                          >
                            {s.difficulty}
                          </span>
                          <span className="history-date">{formatDate(s.date)}</span>
                        </div>
                      </div>
                      <div className="history-score-col">
                        <span className="history-score" style={{ color: grade.color }}>{s.score}%</span>
                        <span className="history-fraction">{s.correctAnswers}/{s.totalQuestions}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
