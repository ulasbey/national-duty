import { useState, useEffect } from 'react'

const STORAGE_KEY = 'nationalDuty_leaderboard'
const MAX_STORED  = 50  // store more entries so each filter has enough data

const MODE_META = {
  current: { label: '🏟️ Current',  color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20'    },
  iconic:  { label: '🏆 Iconic',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
  mixed:   { label: '🔀 Mixed',    color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20'  },
  daily:   { label: '📅 Daily',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
}

// ── Filter config ────────────────────────────────────────────────────────────

const FILTERS = [
  { key: 'all' },
  { key: 'daily' },
  { key: 'current' },
  { key: 'iconic' },
  { key: 'mixed' },
]

// ── Exports ──────────────────────────────────────────────────────────────────

export function getLeaderboard() {
  try {
    const d = localStorage.getItem(STORAGE_KEY)
    return d ? JSON.parse(d) : []
  } catch { return [] }
}

export function saveScore({ mode, score, correctCount, totalQuestions, difficulty = 'normal' }) {
  const board = getLeaderboard()
  board.push({ mode, score, correctCount, totalQuestions, difficulty, date: new Date().toLocaleDateString('en-GB') })
  board.sort((a, b) => b.score - a.score)
  const trimmed = board.slice(0, MAX_STORED)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  return trimmed
}

export function getPersonalBest() {
  const board = getLeaderboard()
  return board.length > 0 ? board[0].score : 0
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ScoreBoard({ onClose, t, lang }) {
  const [board, setBoard]     = useState([])
  const [filter, setFilter]   = useState('all')

  useEffect(() => { setBoard(getLeaderboard()) }, [])

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setBoard([])
  }

  // Apply filter and take top 10
  const filtered = (filter === 'all' ? board : board.filter(e => e.mode === filter)).slice(0, 10)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="animate-card-reveal bg-gradient-to-b from-slate-800 to-slate-900
          rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">{t('leaderboard.title')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('leaderboard.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
          >✕</button>
        </div>

        {/* ✅ Feature 5: Mode filter tabs */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {FILTERS.map(f => {
              const count = f.key === 'all' ? board.length : board.filter(e => e.mode === f.key).length
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                    transition-all duration-200 cursor-pointer border
                    ${active
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/3 border-white/8 text-slate-500 hover:text-slate-300 hover:bg-white/6'
                    }`}
                >
                  <span>{MODE_META[f.key]?.icon || (f.key === 'all' ? '🌐' : '')}</span>
                  <span>{f.key === 'all' ? t('leaderboard.all') : t('start.' + f.key)}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-0.5 font-bold
                      ${active ? 'bg-white/15 text-white/70' : 'bg-white/5 text-slate-600'}`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── List ── */}
        <div className="px-6 py-3 max-h-[380px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🎮</p>
              <p className="text-slate-500 text-sm">
                {board.length === 0
                  ? t('leaderboard.noScores')
                  : t('leaderboard.noModeScores').replace('{mode}', t('start.' + filter))}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((entry, idx) => {
                const meta     = MODE_META[entry.mode] || MODE_META.mixed
                const pct      = entry.totalQuestions > 0 ? Math.round((entry.correctCount / entry.totalQuestions) * 100) : 0
                const rankIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`
                const rankColor = idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600/70' : 'text-slate-600'
                const rowBg    = idx === 0
                  ? 'bg-gradient-to-r from-amber-500/8 to-yellow-500/8 border border-amber-500/20'
                  : 'border border-slate-700/20'

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl ${rowBg} animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 35}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-base font-black w-8 text-center ${rankColor}`}>{rankIcon}</span>
                      <div>
                        {/* Only show mode badge when "All" filter is active */}
                        {filter === 'all' && (
                          <span className={`text-xs font-bold ${meta.color}`}>{t('start.' + entry.mode)}</span>
                        )}
                        <p className={`text-[11px] text-slate-500 ${filter === 'all' ? 'mt-0.5' : ''}`}>
                          {entry.correctCount}/{entry.totalQuestions} · {pct}% · {entry.date}
                          {entry.difficulty && entry.difficulty !== 'normal' && (
                            <span className={`ml-1.5 ${entry.difficulty === 'hard' ? 'text-red-400' : 'text-emerald-400'}`}>
                              {entry.difficulty === 'hard' ? '🔴' : '🟢'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-base font-black text-white tabular-nums">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Clear button ── */}
        {board.length > 0 && (
          <div className="px-6 pb-5 pt-2 border-t border-slate-700/50">
            <button
              onClick={handleClear}
              className="w-full py-2.5 text-sm text-rose-400 border border-rose-500/20 rounded-xl
                hover:bg-rose-500/10 transition-colors cursor-pointer font-medium"
            >
              {t('leaderboard.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
