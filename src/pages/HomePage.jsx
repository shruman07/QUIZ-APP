import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getSessions, getStats } from "../utils/storage";
import { getBestCategory, formatDate, getGrade } from "../utils/stats";
import "../styles/home.css";

const FEATURES = [
  {
    
    title: "Smart Tracking",
    desc: "Every session saved locally — no account needed. Your progress is always there when you return.",
  },
  {
    
    title: "Progress Over Time",
    desc: "See your score trends improve quiz by quiz with detailed history and visual insights.",
  },
  {
    
    title: "Timed Challenges",
    desc: "20 seconds per question keeps you sharp and simulates real interview pressure.",
  },
  {
    
    title: "Category Insights",
    desc: "Discover your strongest and weakest topics across key computer science domains.",
  },
];

export default function HomePage() {
  const sessions = getSessions();
  const stats = getStats();
  const bestCat = getBestCategory(stats.categoryStats);
  const recentSessions = sessions.slice(0, 5);
  const hasHistory = sessions.length > 0;
  const cardsRef = useRef(null);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("cards-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page page-enter">

      {/* ── DEVLORE Full-Width Banner ── */}
      <div className="devlore-banner">
        <span className="devlore-word">DEVLORE</span>
      </div>

      {/* ── Feature Cards (scroll-triggered stacked reveal) ── */}
      <section className="features-section" ref={cardsRef}>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feature-card card"
              style={{ "--card-i": i }}
            >
              <div className="feature-card-stack-shadow" />
              <div className="feature-card-inner">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hero + rest of page ── */}
      <div className="container">

        {/* ── Hero Section ── */}
        <section className="home-hero">
          <h1 className="hero-title">
            Level Up Your Knowledge<br />
            
          </h1>
          <p className="hero-subtitle">
            Take curated tech quizzes, track your progress, and discover your
            strengths and weaknesses across key computer science topics.
          </p>
          <div className="hero-actions">
            <Link to="/setup" className="btn btn-primary btn-lg">
              ▶ &nbsp;Start a Quiz
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              ◈ &nbsp;View Dashboard
            </Link>
          </div>
        </section>

        {/* ── Stats Grid (only if history exists) ── */}
        {hasHistory && (
          <>
            <section className="home-stats">
              <StatCard
                label="Total Quizzes"
                value={stats.totalAttempts}
                sub="attempts"
              />
              <StatCard
                label="Average Score"
                value={`${stats.averageScore}%`}
                sub="across all quizzes"
                highlight={stats.averageScore >= 70}
              />
              <StatCard
                label="Best Category"
                value={bestCat ? bestCat.name.replace(/^.*?: /, "") : "—"}
                sub={bestCat ? `${bestCat.avgScore}% avg` : "play more quizzes"}
                highlight
              />
              <StatCard
                label="Quiz Streak"
                value={sessions.length >= 5 ? "🔥 Hot" : `${sessions.length} done`}
                sub={sessions.length >= 5 ? "keep going!" : "reach 5 to ignite"}
              />
            </section>

            {/* ── Recent Sessions ── */}
            <section className="home-recent">
              <div className="section-header">
                <h2 className="section-title">Recent Sessions</h2>
                <Link to="/dashboard" className="btn btn-ghost btn-sm">
                  View all →
                </Link>
              </div>
              <div className="recent-list">
                {recentSessions.map((session) => {
                  const grade = getGrade(session.score);
                  return (
                    <div key={session.id} className="recent-item card card-padding">
                      <div className="recent-item-left">
                        <div className="recent-grade" style={{ color: grade.color }}>
                          {grade.letter}
                        </div>
                        <div>
                          <div className="recent-category">
                            {session.category.name.replace(/^.*?: /, "")}
                          </div>
                          <div className="recent-meta">
                            <span className={`badge badge-${session.difficulty}`}>
                              {session.difficulty}
                            </span>
                            <span className="recent-date">{formatDate(session.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="recent-score">
                        <span style={{ color: grade.color }}>{session.score}%</span>
                        <span className="recent-fraction">
                          {session.correctAnswers}/{session.totalQuestions}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`stat-card card card-padding ${highlight ? "stat-card--highlight" : ""}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}
