import { getStats } from '../lib/stats'

const MODE_META = {
  current: { label: 'Current',  icon: '🏟️', color: 'text-blue-400',    bar: 'bg-blue-500'   },
  iconic:  { label: 'Iconic',   icon: '🏆', color: 'text-amber-400',   bar: 'bg-amber-500'  },
  mixed:   { label: 'Mixed',    icon: '🔀', color: 'text-purple-400',  bar: 'bg-purple-500' },
  daily:   { label: 'Daily',    icon: '📅', color: 'text-emerald-400', bar: 'bg-emerald-500' },
}

const MODE_ORDER = ['current', 'iconic', 'mixed', 'daily']

export default function StatsModal({ onClose, t, lang }) {
  const s = getStats()
  const accuracyPct = s.totalQuestions > 0
    ? Math.round((s.totalCorrect / s.totalQuestions) * 100)
    : 0

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="animate-card-reveal bg-gradient-to-b from-slate-800 to-slate-900
          rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">{t('stats.title')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('stats.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
          >✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Top row — 3 big numbers */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/30">
              <p className="text-2xl font-black text-white">{s.totalGames}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{t('stats.gamesPlayed')}</p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/30">
              <p className="text-2xl font-black text-emerald-400">{s.totalCorrect}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{t('end.correct')}</p>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-3 text-center border border-amber-500/20">
              <p className="text-2xl font-black text-amber-400">🔥 {s.currentStreak}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{t('game.streak')}</p>
            </div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/20">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('stats.bestStreak')}</p>
              <p className="text-lg font-black text-white">🗓 {s.bestStreak} {lang === 'tr' ? 'gün' : 'days'}</p>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/20">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('stats.accuracy')}</p>
              <p className="text-lg font-black text-cyan-400">{accuracyPct}%</p>
            </div>
          </div>

          {/* Daily streak section */}
          {(s.dailyCurrentStreak > 0 || s.dailyBestStreak > 0 || (s.dailyHistory && s.dailyHistory.length > 0)) && (
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider">📅 {t('start.daily')} {t('game.streak')}</p>
                <span className="text-xs text-emerald-400 font-bold">Best: {s.dailyBestStreak || 0} {lang === 'tr' ? 'gün' : 'days'}</span>
              </div>
              <p className="text-2xl font-black text-emerald-300 mb-3">
                🔥 {s.dailyCurrentStreak || 0} {lang === 'tr' ? 'gün' : `day${s.dailyCurrentStreak !== 1 ? 's' : ''}`}
              </p>
              {/* Last 7 days dots */}
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mr-1">{lang === 'tr' ? 'Son 7' : 'Last 7'}</p>
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const dateStr = d.toISOString().split('T')[0];
                  const played = (s.dailyHistory || []).includes(dateStr);
                  return (
                    <div
                      key={dateStr}
                      title={dateStr}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                        ${played
                          ? 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-700/40 border border-slate-700/30 text-slate-600'
                        }`}
                    >
                      {played ? '✓' : d.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Best scores per mode */}
          {MODE_ORDER.some(m => s.bestScores[m]) && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t('stats.topModes')}</p>
              <div className="flex flex-col gap-1.5">
                {MODE_ORDER.filter(m => s.bestScores[m]).map(m => {
                  const meta = MODE_META[m]
                  return (
                    <div
                      key={m}
                      className="flex items-center justify-between bg-slate-800/40 rounded-xl px-4 py-2.5 border border-slate-700/20"
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
                        {meta.icon} {t('start.' + m)}
                      </span>
                      <span className="text-white font-black text-sm tabular-nums">
                        {s.bestScores[m].toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {s.totalGames === 0 && (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">⚽</p>
              <p className="text-slate-500 text-sm">{lang === 'tr' ? 'İstatistiklerini takip etmek için bir maç bitir!' : 'Play a game to start tracking your stats!'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
