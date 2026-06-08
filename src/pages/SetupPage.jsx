import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TECH_CATEGORIES, DIFFICULTIES, fetchQuestions } from "../utils/api";
import { useQuiz } from "../hooks/useQuiz";
import "../styles/setup.css";

export default function SetupPage() {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();

  const [categoryId, setCategoryId] = useState("");
  const [difficulty, setDifficulty] = useState("any");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const questions = await fetchQuestions(categoryId, difficulty);
      const selectedCat = TECH_CATEGORIES.find((c) => String(c.id) === String(categoryId));
      const category = {
        id: categoryId || "any",
        name: selectedCat ? selectedCat.name.replace(/^[^ ]+ /, "") : "Mixed",
      };
      startQuiz(questions, category, difficulty);
      navigate("/quiz");
    } catch (err) {
      setError(err.message || "Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-enter">
      <div className="container">
        <div className="setup-wrapper">
          {/* ── Header ── */}
          <div className="setup-header text-center">
            <h1>Configure Your Quiz</h1>
            <p className="mt-1">Choose a category and difficulty to get 10 tailored questions</p>
          </div>

          {/* ── Form Card ── */}
          <div className="setup-card card card-padding-lg">
            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Category
              </label>
              <div className="select-wrapper">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={loading}
                >
                  {TECH_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <label className="form-label">
                Difficulty
              </label>
              <div className="difficulty-grid">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    className={`difficulty-btn ${difficulty === d.id ? "difficulty-btn--active" : ""}`}
                    onClick={() => setDifficulty(d.id)}
                    disabled={loading}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="setup-summary">
              <div className="summary-row">
                <span>Questions</span><strong>10</strong>
              </div>
              <div className="summary-row">
                <span>Time per question</span><strong>20 seconds</strong>
              </div>
              <div className="summary-row">
                <span>Type</span><strong>Multiple choice</strong>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="setup-error">
                ⚠️ {error}
              </div>
            )}

            {/* Start Button */}
            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" /> Fetching Questions…
                </>
              ) : (
                "▶  Start Quiz"
              )}
            </button>
          </div>

          {/* ── Tips ── */}
          <div className="setup-tips">
            <div className="tip-card card card-padding">
              <span>You have <strong>20 seconds</strong> per question. Unanswered questions count as wrong.</span>
            </div>
            <div className="tip-card card card-padding">
              <span>Save results after the quiz to track your progress on the dashboard.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
