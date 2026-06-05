// Statistics calculation helpers


export function getBestCategory(categoryStats) {
  const entries = Object.values(categoryStats);
  if (!entries.length) return null;
  return entries.reduce((best, cat) => (cat.avgScore > best.avgScore ? cat : best), entries[0]);
}


export function getWorstCategory(categoryStats) {
  const entries = Object.values(categoryStats);
  if (!entries.length) return null;
  return entries.reduce((worst, cat) => (cat.avgScore < worst.avgScore ? cat : worst), entries[0]);
}


export function getScoreTrend(sessions, limit = 10) {
  return sessions
    .slice(0, limit)
    .reverse()
    .map((s) => ({
      id: s.id,
      date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: s.score,
      category: s.category.name,
    }));
}


export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export function getDifficultyColor(difficulty) {
  const map = { easy: "var(--green)", medium: "var(--yellow)", hard: "var(--red)" };
  return map[difficulty] || "var(--accent)";
}


export function getGrade(score) {
  if (score >= 90) return { letter: "A+", color: "var(--green)" };
  if (score >= 80) return { letter: "A", color: "var(--green)" };
  if (score >= 70) return { letter: "B", color: "var(--teal)" };
  if (score >= 60) return { letter: "C", color: "var(--yellow)" };
  if (score >= 50) return { letter: "D", color: "var(--orange)" };
  return { letter: "F", color: "var(--red)" };
}
