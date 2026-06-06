import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import { useQuizStorage } from "../hooks/useQuizStorage";
import { generateId } from "../utils/storage";
import { getGrade } from "../utils/stats";
import "../styles/results.css";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { questions, answers, category, difficulty, score, correctCount, resetQuiz } = useQuiz();
  const { addSession } = useQuizStorage();

  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);

  // Guard: no quiz data
  if (!questions.length) {
    return (
      <div className="page page-enter">
        <div className="container text-center" style={{ paddingTop: "4rem" }}>
          <p>No quiz data found.</p>
          <Link to="/setup" className="btn btn-primary mt-3">Start a Quiz</Link>
        </div>
      </div>
    );
  }

  const wrongAnswers = answers.filter((a) => !a.isCorrect);
  const grade = getGrade(score);

  function handleSave() {
    if (saved) return;
    const session = {
      id: generateId(),
      date: new Date().toISOString(),
      category,
      difficulty,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      score,
      questions: answers,
    };
    addSession(session);
    setSaved(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleRetry() {
    resetQuiz();
    navigate("/setup");
  }

  return (
    <div className="page page-enter">
      <div className="container">
        <div className="results-wrapper">
          {/* ── Score Ring ── */}
          <div className="results-hero">
            <div className="score-ring-wrapper">
              <svg className="score-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" className="ring-track" />
                <circle
                  cx="60" cy="60" r="52"
                  className="ring-fill"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 52}`,
                    strokeDashoffset: `${2 * Math.PI * 52 * (1 - score / 100)}`,
                    stroke: grade.color,
                  }}
                />
              </svg>
              <div className="score-ring-inner">
                <span className="score-ring-percent" style={{ color: grade.color }}>{score}%</span>
                <span className="score-ring-grade" style={{ color: grade.color }}>{grade.letter}</span>
              </div>
            </div>

            <div className="results-title-block">
              <h1>{score >= 70 ? "Great Work! 🎉" : score >= 50 ? "Good Effort! 💪" : "Keep Practicing! 🔁"}</h1>
              <p className="results-subtitle">
                {category?.name} · <span className={`badge badge-${difficulty}`}>{difficulty}</span>
              </p>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="results-stats grid-3">
            <div className="card card-padding text-center">
              <div className="rs-icon">✅</div>
              <div className="rs-value" style={{ color: "var(--green)" }}>{correctCount}</div>
              <div className="rs-label">Correct</div>
            </div>
            <div className="card card-padding text-center">
              <div className="rs-icon">❌</div>
              <div className="rs-value" style={{ color: "var(--red)" }}>{questions.length - correctCount}</div>
              <div className="rs-label">Wrong</div>
            </div>
            <div className="card card-padding text-center">
              <div className="rs-icon">📋</div>
              <div className="rs-value">{questions.length}</div>
              <div className="rs-label">Total</div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="results-actions">
            <button
              className={`btn ${saved ? "btn-ghost" : "btn-primary"} btn-lg`}
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? "✓ Saved to History" : "💾 Save to History"}
            </button>
            <button className="btn btn-secondary" onClick={handleRetry}>
              🔁 Try Again
            </button>
            <Link to="/dashboard" className="btn btn-ghost">
              ◈ Dashboard
            </Link>
          </div>

          {/* ── Wrong Answers ── */}
          {wrongAnswers.length > 0 && (
            <section className="results-wrong">
              <h2 className="section-title mb-3">
                ❌ Questions to Review ({wrongAnswers.length})
              </h2>
              <div className="wrong-list">
                {wrongAnswers.map((item, i) => (
                  <div
                    key={i}
                    className={`wrong-item card card-padding ${expandedIdx === i ? "wrong-item--open" : ""}`}
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  >
                    <div className="wrong-header">
                      <span className="wrong-num">#{i + 1}</span>
                      <span className="wrong-q">{item.question}</span>
                      <span className="wrong-toggle">{expandedIdx === i ? "▲" : "▼"}</span>
                    </div>

                    {expandedIdx === i && (
                      <div className="wrong-detail">
                        <div className="wrong-answer-row wrong-answer-row--correct">
                          <span className="war-label">✓ Correct</span>
                          <span>{item.correctAnswer}</span>
                        </div>
                        {item.userAnswer ? (
                          <div className="wrong-answer-row wrong-answer-row--wrong">
                            <span className="war-label">✗ Your Answer</span>
                            <span>{item.userAnswer}</span>
                          </div>
                        ) : (
                          <div className="wrong-answer-row wrong-answer-row--skip">
                            <span className="war-label">⏱ Time expired</span>
                            <span>Question was skipped</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Toast ── */}
      {showToast && (
        <div className="toast">
          ✓ Quiz saved to your history!
        </div>
      )}
    </div>
  );
}
