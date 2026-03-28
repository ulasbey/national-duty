// Daily Challenge streak tracker — stored in localStorage

const KEY = 'ndStreak';

function yesterday() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

function today() {
  return new Date().toISOString().split('T')[0];
}

/** Read current streak: { count, lastDate } */
export function getStreak() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { count: 0, lastDate: null };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lastDate: null };
  }
}

/** Call after completing a daily challenge. Updates and returns new streak count. */
export function recordDailyStreak() {
  const todayStr = today();
  const streak = getStreak();

  // Already recorded today → don't double-count
  if (streak.lastDate === todayStr) return streak.count;

  let newCount;
  if (streak.lastDate === yesterday()) {
    // Consecutive day → increment
    newCount = streak.count + 1;
  } else {
    // Streak broken or first time
    newCount = 1;
  }

  const updated = { count: newCount, lastDate: todayStr };
  try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
  return newCount;
}

/** Returns streak count if still active (last completed was today or yesterday) */
export function getActiveStreak() {
  const { count, lastDate } = getStreak();
  if (!lastDate) return 0;
  if (lastDate === today() || lastDate === yesterday()) return count;
  return 0; // expired
}
