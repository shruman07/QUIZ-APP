// localStorage schema helpers
// Schema:
// "devlore_sessions" → Array<QuizSession>
// "devlore_stats"    → AggregatedStats

const SESSIONS_KEY = "devlore_sessions";
const STATS_KEY = "devlore_stats";



export function getSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addSession(session) {
  const sessions = getSessions();
  sessions.unshift(session); // newest first
  saveSessions(sessions);
  recalculateAndSaveStats(sessions);
  return sessions;
}

export function clearAllData() {
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(STATS_KEY);
}

/* ─── Stats ─────────────────────────────────────────── */

export function getStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          totalAttempts: 0,
          averageScore: 0,
          categoryStats: {},
        };
  } catch {
    return { totalAttempts: 0, averageScore: 0, categoryStats: {} };
  }
}

export function recalculateAndSaveStats(sessions) {
  if (!sessions.length) {
    localStorage.setItem(STATS_KEY, JSON.stringify({ totalAttempts: 0, averageScore: 0, categoryStats: {} }));
    return;
  }

  const totalAttempts = sessions.length;
  const totalScore = sessions.reduce((acc, s) => acc + s.score, 0);
  const averageScore = Math.round(totalScore / totalAttempts);

  const categoryStats = {};
  for (const s of sessions) {
    const catId = String(s.category.id);
    if (!categoryStats[catId]) {
      categoryStats[catId] = { name: s.category.name, attempts: 0, totalScore: 0, avgScore: 0 };
    }
    categoryStats[catId].attempts += 1;
    categoryStats[catId].totalScore += s.score;
    categoryStats[catId].avgScore = Math.round(categoryStats[catId].totalScore / categoryStats[catId].attempts);
  }

  const stats = { totalAttempts, averageScore, categoryStats };
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

/* ─── ID Generator ───────────────────────────────────── */

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
