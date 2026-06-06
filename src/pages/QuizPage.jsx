import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { useTimer } from "../hooks/useTimer";
import "../styles/quiz.css";

const QUESTION_TIME = 20;

export default function QuizPage() {
  const navigate = useNavigate();
  const { questions, currentIndex, isFinished, answerQuestion, skipQuestion, resetQuiz } = useQuiz();

  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Auto-advance to next question when timer expires
  const handleExpire = useCallback(() => {
    if (!revealed) {
      skipQuestion();
      setSelected(null);
      setRevealed(false);
    }
  }, [revealed, skipQuestion]);

  const { timeLeft, progress, restart } = useTimer(QUESTION_TIME, handleExpire);

  // Redirect if quiz not active
  useEffect(() => {
    if (!questions.length) {
      navigate("/setup", { replace: true });
    }
  }, [questions, navigate]);

  // Navigate to results when finished
  useEffect(() => {
    if (isFinished) {
      navigate("/results");
    }
  }, [isFinished, navigate]);

  // Restart timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      restart(QUESTION_TIME);
    }
  }, [currentIndex, currentQuestion, restart]);

  // Reset local state when question changes (use layout effect to avoid warning)
  useEffect(() => {
    // schedule reset after render, not synchronously
    const id = setTimeout(() => {
      setSelected(null);
      setRevealed(false);
    }, 0);
    return () => clearTimeout(id);
  }, [currentIndex]);

  function handleAnswer(answer) {
    if (revealed) return;
    setSelected(answer);
    setRevealed(true);
    // After 1.2s, advance
    setTimeout(() => {
      answerQuestion(answer);
      setSelected(null);
      setRevealed(false);
    }, 1200);
  }

  if (!currentQuestion) return null;

  const progressPct = (currentIndex / questions.length) * 100;
  const timerDanger = timeLeft <= 5;

  return (
    <div className="page page-enter">
      <div className="container">
        <div className="quiz-wrapper">
          
          <div className="quiz-topbar">
            <div className="quiz-progress-label">
              Question <strong>{currentIndex + 1}</strong> / {questions.length}
            </div>
            <div className={`quiz-timer ${timerDanger ? "quiz-timer--danger" : ""}`}>
              <svg className="timer-ring" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" className="timer-track" />
                <circle
                  cx="22" cy="22" r="18"
                  className="timer-fill"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 18}`,
                    strokeDashoffset: `${2 * Math.PI * 18 * (1 - progress / 100)}`,
                    stroke: timerDanger ? "var(--red)" : "var(--accent)",
                  }}
                />
              </svg>
              <span className="timer-text">{timeLeft}</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                resetQuiz();
                navigate("/setup");
              }}
            >
              ✕ Quit
            </button>
          </div>

          <div className="quiz-bar-track">
            <div className="quiz-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="quiz-card card card-padding-lg">
            <div className="quiz-category-badge badge badge-accent">
              {currentQuestion.category}
            </div>

            <h2 className="quiz-question">{currentQuestion.question}</h2>

            <div className="quiz-answers">
              {currentQuestion.allAnswers.map((answer, i) => {
                let cls = "answer-btn";
                if (revealed) {
                  if (answer === currentQuestion.correctAnswer) cls += " answer-btn--correct";
                  else if (answer === selected) cls += " answer-btn--wrong";
                  else cls += " answer-btn--dimmed";
                } else if (selected === answer) {
                  cls += " answer-btn--selected";
                }

                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(answer)}
                    disabled={revealed}
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="answer-text">{answer}</span>
                    {revealed && answer === currentQuestion.correctAnswer && (
                      <span className="answer-check">✓</span>
                    )}
                    {revealed && answer === selected && answer !== currentQuestion.correctAnswer && (
                      <span className="answer-cross">✗</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {!revealed && (
            <div className="quiz-skip-row">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  skipQuestion();
                }}
              >
                Skip →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
