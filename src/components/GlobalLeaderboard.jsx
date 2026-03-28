import { useState, useEffect } from 'react';
import { fetchGlobalLeaderboard, fetchDailyLeaderboard } from '../lib/supabase';

const DIFF_TABS = [
  { key: null,     label: 'All' },
  { key: 'easy',   label: '🟢 Easy' },
  { key: 'normal', label: '🟡 Normal' },
  { key: 'hard',   label: '🔴 Hard' },
];

const MODE_ICON = {
  daily:    '📅',
  iconic:   '🏆',
  worldcup: '🌍',
  euro:     '🇪🇺',
  conmebol: '🌎',
  concacaf: '🏆',
  afcon:    '🌍',
  current:  '🏟️',
  mixed:    '🔀',
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-xs font-bold text-slate-500 w-6 text-center tabular-nums">{rank}</span>;
}

export default function GlobalLeaderboard({ onClose, t }) {
  const [tab, setTab]           = useState('global'); // 'global' | 'daily'
  const [difficulty, setDiff]   = useState(null);
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const load = tab === 'daily'
      ? fetchDailyLeaderboard()
      : fetchGlobalLeaderboard(difficulty);

    load.then(({ data, error }) => {
      if (error) setError(error.message);
      else setRows(data || []);
      setLoading(false);
    });
  }, [tab, difficulty]);

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-card-reveal w-full max-w-sm bg-[#111827] border border-white/10
        rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '88dvh' }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-white">🌍 {t('globalLB.title')}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center
                justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
            >✕</button>
          </div>

          {/* Global / Daily tabs */}
          <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl">
            {[
              { key: 'global', label: t('globalLB.global') },
              { key: 'daily',  label: t('globalLB.daily') },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${tab === key
                    ? 'bg-white/15 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Difficulty filter (global only) */}
          {tab === 'global' && (
            <div className="flex gap-1 mt-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {DIFF_TABS.map(({ key, label }) => (
                <button
                  key={String(key)}
                  onClick={() => setDiff(key)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer
                    ${difficulty === key
                      ? 'bg-emerald-500/25 border border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 border border-white/8 text-slate-500 hover:text-slate-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-1.5">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500 text-sm animate-pulse">{t('common.loading')}</div>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-400 text-sm text-center">{t('globalLB.error')}</p>
            </div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span className="text-3xl">🏆</span>
              <p className="text-slate-500 text-sm text-center">{t('globalLB.empty')}</p>
            </div>
          )}
          {!loading && !error && rows.map((row, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                ${i === 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/3 border border-white/5'}`}
            >
              <RankBadge rank={i + 1} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-tight">{row.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  {tab === 'global' && row.difficulty && (
                    <span className={
                      row.difficulty === 'easy'   ? 'text-emerald-500' :
                      row.difficulty === 'hard'   ? 'text-red-400' :
                      'text-amber-400'
                    }>
                      {row.difficulty === 'easy' ? '🟢' : row.difficulty === 'hard' ? '🔴' : '🟡'} {row.difficulty}
                    </span>
                  )}
                  {tab === 'global' && row.difficulty && <span>·</span>}
                  <span>{row.correct_count}/{row.total_questions ?? 5} {t('end.correct').toLowerCase()}</span>
                  <span>·</span>
                  <span>{timeAgo(row.created_at)}</span>
                </p>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1">
                  {row.mode && MODE_ICON[row.mode] && (
                    <span className="text-sm leading-none" title={row.mode}>
                      {MODE_ICON[row.mode]}
                    </span>
                  )}
                  <p className="text-base font-black text-[var(--accent-gold)] tabular-nums">
                    {row.score.toLocaleString()}
                  </p>
                </div>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">pts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/8">
          <p className="text-[10px] text-slate-600 text-center">{t('globalLB.footer')}</p>
        </div>
      </div>
    </div>
  );
}
