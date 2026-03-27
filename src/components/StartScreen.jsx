import { useState } from 'react';

function getTodayLabel(lang) {
    return new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function isDailyDone() {
    try {
        const saved = JSON.parse(localStorage.getItem('ndDailyResult') || 'null');
        const today = new Date().toISOString().split('T')[0];
        return saved?.date === today;
    } catch {
        return false;
    }
}

const DIFFICULTIES = [
    { key: 'easy',   emoji: '🟢' },
    { key: 'normal', emoji: '🟡' },
    { key: 'hard',   emoji: '🔴' },
];

// ── Sub-screen: Legendary Modes ───────────────────────────────────────────────
function LegendaryScreen({ onSelectMode, onBack, t }) {
    const modes = [
        {
            key: 'worldcup',
            icon: '/icons/trophies/world-cup.png',
            title: t('start.worldcup'),
            subtitle: t('start.legendsSubtitle'),
            desc: `94 ${t('end.questions').toLowerCase()}`,
            color: 'from-yellow-950/90 to-[#0d0900]',
            border: 'border-yellow-600/30 hover:border-yellow-500/60',
            accent: 'text-yellow-400',
            shadow: 'hover:shadow-yellow-500/10',
            active: true,
        },
        {
            key: 'euro',
            icon: '/icons/trophies/euro-cup.png',
            title: t('start.euro'),
            subtitle: t('start.legendsSubtitle'),
            desc: `32 ${t('end.questions').toLowerCase()}`,
            color: 'from-blue-950/90 to-[#060810]',
            border: 'border-blue-600/30 hover:border-blue-500/60',
            accent: 'text-blue-400',
            shadow: 'hover:shadow-blue-500/10',
            active: true,
        },
        {
            key: 'conmebol',
            icon: '/icons/trophies/copa-america.png',
            title: t('start.conmebol'),
            subtitle: t('start.legendsSubtitle'),
            desc: `20 ${t('end.questions').toLowerCase()}`,
            color: 'from-green-950/90 to-[#060d06]',
            border: 'border-green-600/30 hover:border-green-500/60',
            accent: 'text-green-400',
            shadow: 'hover:shadow-green-500/10',
            active: true,
        },
        {
            key: 'concacaf',
            icon: '/icons/trophies/gold-cup.png',
            title: t('start.concacaf'),
            subtitle: t('start.legendsSubtitle'),
            desc: `22 ${t('end.questions').toLowerCase()}`,
            color: 'from-red-950/90 to-[#0d0606]',
            border: 'border-red-600/30 hover:border-red-500/60',
            accent: 'text-red-400',
            shadow: 'hover:shadow-red-500/10',
            active: true,
        },
        {
            key: 'afcon',
            icon: '/icons/trophies/afcon-cup.png',
            title: t('start.afcon'),
            subtitle: t('start.legendsSubtitle'),
            desc: `24 ${t('end.questions').toLowerCase()}`,
            color: 'from-orange-950/90 to-[#0d0700]',
            border: 'border-orange-600/30 hover:border-orange-500/60',
            accent: 'text-orange-400',
            shadow: 'hover:shadow-orange-500/10',
            active: true,
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-8">
            {/* Back */}
            <button onClick={onBack}
                className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/5 border border-white/10
                    flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10
                    transition-all duration-200 cursor-pointer text-base">←
            </button>

            {/* Header */}
            <div className="text-center mb-7 animate-fade-in-up">
                <div className="mb-2">
                    <img src="/icons/trophies/master-trophy.png" alt="Trophy" className="w-12 h-12 mx-auto object-contain drop-shadow-2xl" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">{t('start.legendaryTitle')}</h1>
                <p className="text-xs text-white/35 mt-1">{t('start.legendarySubtitle')}</p>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-3">
                {/* 2×3 tournament grid */}
                <div className="grid grid-cols-2 gap-3">
                    {modes.map((m, i) => (
                        m.active ? (
                            <button key={m.key}
                                onClick={() => onSelectMode(m.key)}
                                className={`group relative p-4 rounded-2xl cursor-pointer text-center
                                    bg-gradient-to-br ${m.color} border ${m.border} flex flex-col items-center
                                    transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${m.shadow}
                                    animate-fade-in-up`}
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="mb-2.5 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                    <img src={m.icon} alt={m.title} className="w-9 h-9 object-contain drop-shadow-lg" />
                                </div>
                                <div className="text-xs font-bold text-white leading-tight">{m.title}</div>
                                <div className={`text-xs font-bold ${m.accent} leading-tight`}>{m.subtitle}</div>
                            </button>
                        ) : (
                            <div key={m.key}
                                className={`relative p-4 rounded-2xl opacity-40 cursor-not-allowed text-center
                                    bg-gradient-to-br ${m.color} border ${m.border} flex flex-col items-center
                                    animate-fade-in-up`}
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="mb-2.5 grayscale opacity-50 flex justify-center">
                                    <img src={m.icon} alt={m.title} className="w-9 h-9 object-contain" />
                                </div>
                                <div className="text-xs font-bold text-white/60 leading-tight">{m.title}</div>
                                <div className={`text-xs font-bold ${m.accent} leading-tight`}>{m.subtitle}</div>
                                <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full
                                    bg-amber-500/20 text-amber-400/70 border border-amber-500/15">Soon</span>
                            </div>
                        )
                    ))}
                </div>

                {/* Mixed Legends — full width */}
                <button
                    onClick={() => onSelectMode('mixed')}
                    className="group w-full p-4 rounded-2xl cursor-pointer text-center
                        bg-gradient-to-br from-purple-950/80 to-[#08040d]
                        border border-purple-600/25 hover:border-purple-500/55
                        transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10
                        animate-fade-in-up flex flex-col items-center gap-2"
                    style={{ animationDelay: '240ms' }}
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700
                        flex items-center justify-center shadow-lg shrink-0
                        group-hover:scale-110 transition-transform duration-300 p-2">
                        <img src="/icons/trophies/master-trophy.png" alt="Mixed" className="w-full h-full object-contain brightness-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">{t('start.mixedLegends')}</div>
                        <div className="text-xs text-white/35 mt-0.5">{t('start.allLegendary')}</div>
                    </div>
                    <div className="hidden text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0">→</div>
                </button>
            </div>
        </div>
    );
}

// ── Main Home Screen ──────────────────────────────────────────────────────────
export default function StartScreen({ onSelectMode, onShowLeaderboard, onShowStats, difficulty = 'normal', onDifficultyChange, lang, toggleLang, t }) {
    const [view, setView] = useState('home'); // 'home' | 'legendary'
    const dailyDone = isDailyDone();

    if (view === 'legendary') {
        return <LegendaryScreen onSelectMode={onSelectMode} onBack={() => setView('home')} t={t} />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-8 relative">

            {/* ── Top-right icon buttons ── */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button onClick={toggleLang} title={lang === 'en' ? 'Türkçe' : 'English'}
                    className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-1.5
                        text-[var(--text-secondary)] hover:text-white hover:bg-white/10 hover:border-white/20
                        transition-all duration-200 cursor-pointer text-xs font-bold shadow-lg">
                    <div className="flex items-center gap-1.5">
                        {lang === 'en' ? (
                            <svg className="w-4 h-3 rounded-sm shadow-sm" viewBox="0 0 60 30">
                                <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
                                <path clipPath="url(#s)" d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                                <path clipPath="url(#s)" d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                                <path clipPath="url(#s)" d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
                                <path clipPath="url(#s)" d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                                <path clipPath="url(#s)" d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                            </svg>
                        ) : (
                            <svg className="w-4 h-3 rounded-sm shadow-sm" viewBox="0 0 1200 800">
                                <rect width="1200" height="800" fill="#E30A17"/>
                                <circle cx="425" cy="400" r="200" fill="#fff"/>
                                <circle cx="475" cy="400" r="160" fill="#E30A17"/>
                                <path fill="#fff" d="M701.1,400l-117.8,38.3l72.8-100.3V462l-72.8-100.3L701.1,400z"/>
                            </svg>
                        )}
                        <span className="uppercase text-[10px] tracking-tight font-bold">{lang === 'en' ? 'English' : 'Türkçe'}</span>
                    </div>
                </button>
                <button onClick={onShowStats} title="Stats"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                        text-[var(--text-secondary)] hover:text-white hover:bg-white/10 hover:border-white/20
                        transition-all duration-200 cursor-pointer text-base">📊</button>
                <button onClick={onShowLeaderboard} title="Leaderboard"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                        text-[var(--text-secondary)] hover:text-white hover:bg-white/10 hover:border-white/20
                        transition-all duration-200 cursor-pointer text-base">🏅</button>
            </div>

            {/* ── Hero ── */}
            <div className="text-center mb-7 animate-fade-in-up">
                <div className="text-5xl sm:text-6xl mb-3 animate-float">⚽</div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-[var(--accent-gold)] to-amber-300 bg-clip-text text-transparent">
                    {t('start.title')}
                </h1>
                <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
                    {t('start.subtitle')}
                </p>
            </div>

            {/* ── Mode Cards ── */}
            <div className="w-full max-w-sm flex flex-col gap-3">

                {/* Daily Challenge */}
                <button
                    onClick={() => onSelectMode('daily')}
                    className="group relative w-full rounded-2xl cursor-pointer overflow-hidden
                     bg-gradient-to-br from-emerald-950 via-[#071a0f] to-[#04110a]
                     border border-emerald-500/30 hover:border-emerald-400/60
                     transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                     hover:shadow-emerald-500/20 text-left animate-fade-in-up"
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="relative flex items-center justify-between px-5 pt-3 pb-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/80">{t('start.daily')}</span>
                        <div className="flex items-center gap-2">
                            {dailyDone && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ {t('end.shared').replace('!', '')}</span>}
                            <span className="text-[10px] text-emerald-400/60 font-medium">{getTodayLabel(lang)}</span>
                        </div>
                    </div>
                    <div className="relative flex items-center gap-4 px-5 pb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700
                            flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30
                            group-hover:scale-110 transition-transform duration-300 shrink-0">📅</div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-black text-white group-hover:text-emerald-200 transition-colors leading-tight">
                                {dailyDone ? t('start.playAgain') : t('start.todaysPuzzle')}
                            </h2>
                            <p className="text-xs text-emerald-300/60 mt-0.5">{t('start.dailyDesc')}</p>
                        </div>
                        <div className="text-emerald-500/60 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all duration-300 text-xl shrink-0">→</div>
                    </div>
                    <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                </button>

                {/* Legendary Squads → opens sub-screen */}
                <button
                    onClick={() => setView('legendary')}
                    className="group relative w-full p-4 rounded-2xl cursor-pointer text-left
                     bg-gradient-to-br from-yellow-950/70 to-[#0d0a00]
                     border border-yellow-600/25 hover:border-yellow-500/55
                     transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10
                     animate-fade-in-up flex items-center gap-4"
                    style={{ animationDelay: '180ms' }}
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-700
                        flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0
                        group-hover:scale-110 transition-transform duration-300 p-2">
                        <img src="/icons/trophies/master-trophy.png" alt="Legends" className="w-full h-full object-contain brightness-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">{t('start.legendaryTitle')}</div>
                        <div className="text-xs text-white/35 mt-0.5">{t('start.legendaryDesc')}</div>
                    </div>
                    <div className="text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0">→</div>
                </button>

                {/* Coming Soon */}
                <div className="flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '260ms' }}>
                    {/* Current Squads */}
                    <div className="relative w-full p-4 rounded-2xl opacity-45 cursor-not-allowed
                         bg-gradient-to-br from-white/[0.03] to-transparent border border-white/6
                         flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700
                            flex items-center justify-center text-xl shrink-0 grayscale">🏟️</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white/60">{t('start.currentSquads')}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400/80 border border-amber-500/20 uppercase">{t('start.soon')}</span>
                            </div>
                            <p className="text-xs text-white/25 mt-0.5">{t('start.currentDesc')}</p>
                        </div>
                        <div className="text-white/15 shrink-0">🔒</div>
                    </div>

                    {/* 2026 Road To World Cup */}
                    <div className="relative w-full p-4 rounded-2xl opacity-45 cursor-not-allowed
                         bg-gradient-to-br from-white/[0.03] to-transparent border border-white/6
                         flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-600
                            flex items-center justify-center text-xl shrink-0 grayscale">🗺️</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white/60">Road To World Cup 2026</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400/80 border border-amber-500/20 uppercase">{t('start.soon')}</span>
                            </div>
                            <p className="text-xs text-white/25 mt-0.5">{lang === 'en' ? 'World Cup 2026 qualifying groups' : 'Dünya Kupası 2026 eleme grupları'}</p>
                        </div>
                        <div className="text-white/15 shrink-0">🔒</div>
                    </div>
                </div>
            </div>

            {/* ── Difficulty ── */}
            <div className="w-full max-w-sm mt-5 animate-fade-in-up" style={{ animationDelay: '320ms' }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/20 text-center mb-2">{t('start.difficulty')}</p>
                <div className="flex gap-2">
                    {DIFFICULTIES.map(d => {
                        const active = difficulty === d.key;
                        return (
                            <button key={d.key} onClick={() => onDifficultyChange?.(d.key)}
                                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl
                                    border text-xs font-semibold transition-all duration-200 cursor-pointer
                                    ${active ? 'bg-white/10 border-white/20 text-white scale-[1.03]'
                                             : 'bg-white/3 border-white/8 text-slate-500 hover:text-slate-300 hover:bg-white/6'}`}
                            >
                                <span className="text-base leading-none">{d.emoji}</span>
                                <span className={active ? 'text-white' : ''}>{t('start.' + d.key)}</span>
                                <span className="text-[9px] text-white/25 font-normal">
                                    {d.key === 'easy' ? '30s · 3 hints' : d.key === 'normal' ? '15s · 2 hints' : '8s · no hints'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="mt-5 text-xs text-white/30 animate-fade-in-up flex items-center justify-center gap-1.5" style={{ animationDelay: '380ms' }}>
                {t('start.madeBy')} <img src="/pitchmind.png" alt="PitchMind" className="w-6 h-6 object-contain drop-shadow-md" /> {t('start.byLabs')}
            </div>
        </div>
    );
}
