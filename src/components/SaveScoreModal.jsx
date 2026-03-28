import { useState } from 'react';
import { saveScoreToGlobal, saveDailyScore } from '../lib/supabase';

export default function SaveScoreModal({ score, correctCount, totalQuestions, difficulty, mode, onClose, t }) {
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('ndPlayerName') || ''; } catch { return ''; }
  });
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error

  const isDaily = mode === 'daily';

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStatus('saving');
    try {
      localStorage.setItem('ndPlayerName', trimmed);
    } catch {}

    const payload = { name: trimmed, score, correctCount };
    const { error } = isDaily
      ? await saveDailyScore(payload)
      : await saveScoreToGlobal({ ...payload, totalQuestions, difficulty, mode });

    if (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      setStatus('saved');
      setTimeout(onClose, 1400);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-card-reveal w-full max-w-sm bg-[#111827] border border-white/10
        rounded-2xl shadow-2xl p-6 flex flex-col gap-5">

        <div className="text-center">
          <div className="text-4xl mb-2">🏅</div>
          <h2 className="text-xl font-black text-white">
            {t('save.title')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isDaily ? t('save.subtitleDaily') : t('save.subtitle')}
          </p>
        </div>

        {/* Score recap */}
        <div className="flex justify-around py-3 border-y border-white/8 rounded-xl bg-white/3">
          <div className="text-center">
            <p className="text-2xl font-black text-[var(--accent-gold)]">{score.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{t('end.totalScore')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-400">{correctCount}/{totalQuestions}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{t('end.correct')}</p>
          </div>
        </div>

        {/* Name input */}
        {status !== 'saved' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {t('save.nameLabel')}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              maxLength={30}
              placeholder={t('save.namePlaceholder')}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15
                text-white placeholder:text-slate-600 text-sm focus:outline-none
                focus:border-emerald-500/60 transition-colors"
            />
          </div>
        )}

        {/* Status messages */}
        {status === 'saved' && (
          <div className="flex items-center justify-center gap-2 py-2 text-emerald-400 font-semibold animate-bounce-in">
            <span className="text-xl">✓</span> {t('save.saved')}
          </div>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400 text-center">{t('save.error')}</p>
        )}

        {/* Buttons */}
        {status !== 'saved' && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-400
                bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              {t('save.skip')}
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || status === 'saving'}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white cursor-pointer
                bg-gradient-to-r from-emerald-500 to-emerald-600
                hover:scale-[1.02] active:scale-[0.98] transition-transform
                disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {status === 'saving' ? '…' : t('save.submit')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
