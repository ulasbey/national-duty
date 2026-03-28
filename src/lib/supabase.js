import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── Global Scores ─────────────────────────────────────────────────────────────

export async function saveScoreToGlobal({ name, score, correctCount, totalQuestions, difficulty, mode }) {
  const row = {
    name: name.trim().slice(0, 30),
    score,
    correct_count: correctCount,
    total_questions: totalQuestions,
    difficulty,
    mode: mode || 'mixed',
  }
  const { data, error } = await supabase.from('nd_scores').insert([row]).select()
  return { data, error }
}

export async function fetchGlobalLeaderboard(difficulty = null) {
  let query = supabase
    .from('nd_scores')
    .select('name, score, correct_count, total_questions, difficulty, mode, created_at')
    .order('score', { ascending: false })
    .limit(20)
  if (difficulty) query = query.eq('difficulty', difficulty)
  const { data, error } = await query
  return { data, error }
}

// ── Daily Scores ──────────────────────────────────────────────────────────────

export async function saveDailyScore({ name, score, correctCount }) {
  const date = new Date().toISOString().split('T')[0] // UTC date "YYYY-MM-DD"
  const row = { date, name: name.trim().slice(0, 30), score, correct_count: correctCount }
  const { data, error } = await supabase.from('nd_daily_scores').insert([row]).select()
  return { data, error }
}

export async function fetchDailyLeaderboard() {
  const date = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('nd_daily_scores')
    .select('name, score, correct_count, created_at')
    .eq('date', date)
    .order('score', { ascending: false })
    .limit(20)
  return { data, error }
}
