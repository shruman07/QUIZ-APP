import "./scorebar.css";

/**
 * CSS-only score bar — no chart libraries
 * @param {string} label
 * @param {number} score - 0 to 100
 * @param {string} color - CSS color value
 * @param {number} attempts - optional attempt count
 */
export default function ScoreBar({ label, score, color = "var(--accent)", attempts }) {
  const clampedScore = Math.min(100, Math.max(0, score));

  return (
    <div className="score-bar-wrapper">
      <div className="score-bar-meta">
        <span className="score-bar-label">{label}</span>
        <div className="score-bar-right">
          {attempts !== undefined && (
            <span className="score-bar-attempts">{attempts} attempt{attempts !== 1 ? "s" : ""}</span>
          )}
          <span className="score-bar-value" style={{ color }}>
            {clampedScore}%
          </span>
        </div>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{
            width: `${clampedScore}%`,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            boxShadow: `0 0 12px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}
