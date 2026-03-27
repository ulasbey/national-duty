// ── National Duty — Stats tracking ───────────────────────────
// Persisted in localStorage. Tracks games per mode, streaks, accuracy.

const STATS_KEY = 'nationalDuty_stats'

function defaultStats() {
  return {
    totalGames: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    currentStreak: 0,   // consecutive days played
    bestStreak: 0,
    lastPlayedDate: null,
    bestScores: {},        // { current: 12400, iconic: 8300, mixed: 9100, daily: 6200 }
    gamesPerMode: {},      // { current: 5, iconic: 3, … }
    bestAnswerStreaks: {},  // best in-game answer streak per mode
    dailyCurrentStreak: 0,
    dailyBestStreak: 0,
    dailyHistory: [],       // ISO date strings of days daily challenge was completed
  }
}

export function getStats() {
  try {
    const d = localStorage.getItem(STATS_KEY)
    return d ? { ...defaultStats(), ...JSON.parse(d) } : defaultStats()
  } catch { return defaultStats() }
}

function prevDay(dateStr) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

/**
 * Call this when a game session ends.
 * @param {object} p
 * @param {string} p.mode           — 'current' | 'iconic' | 'mixed' | 'daily'
 * @param {number} p.score
 * @param {number} p.correctCount
 * @param {number} p.totalQuestions
 * @param {number} p.bestAnswerStreak — longest answer streak in that session
 */
export function recordGame({ mode, score, correctCount, totalQuestions, bestAnswerStreak = 0, difficulty = 'normal' }) {
  const stats = getStats()
  const today = new Date().toISOString().split('T')[0]

  // Daily login streak
  if (stats.lastPlayedDate === today) {
    // already played today, no streak change
  } else if (stats.lastPlayedDate === prevDay(today)) {
    stats.currentStreak += 1
  } else {
    stats.currentStreak = 1
  }
  stats.lastPlayedDate = today
  stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)

  // Daily challenge streak (separate from general play streak)
  if (mode === 'daily' && !stats.dailyHistory.includes(today)) {
    stats.dailyHistory.push(today);
    stats.dailyHistory = stats.dailyHistory.slice(-60); // keep 60 days
    const yesterday = prevDay(today);
    if (stats.dailyHistory.includes(yesterday)) {
      stats.dailyCurrentStreak = (stats.dailyCurrentStreak || 0) + 1;
    } else {
      stats.dailyCurrentStreak = 1;
    }
    stats.dailyBestStreak = Math.max(stats.dailyBestStreak || 0, stats.dailyCurrentStreak);
  }

  stats.totalGames += 1
  stats.totalCorrect += correctCount
  stats.totalQuestions += totalQuestions

  if (!stats.bestScores[mode] || score > stats.bestScores[mode]) {
    stats.bestScores[mode] = score
  }
  if (!stats.bestAnswerStreaks[mode] || bestAnswerStreak > stats.bestAnswerStreaks[mode]) {
    stats.bestAnswerStreaks[mode] = bestAnswerStreak
  }
  stats.gamesPerMode[mode] = (stats.gamesPerMode[mode] || 0) + 1

  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  return stats
}
