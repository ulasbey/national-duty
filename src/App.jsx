import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import StartScreen from './components/StartScreen';
import FootballPitch from './components/FootballPitch';
import LogoTester from './components/LogoTester';
import ScoreBoard, { saveScore } from './components/ScoreBoard';
import StatsModal from './components/StatsModal';
import SaveScoreModal from './components/SaveScoreModal';
import GlobalLeaderboard from './components/GlobalLeaderboard';
// teamsData loaded lazily (see useEffect below)
import translations from './data/translations';
import { isSoundOn, toggleSound, playDing, playFail, playTick, playStadiumSound, playComplete, playGameOver } from './lib/sounds';
import { recordGame } from './lib/stats';
import { shareResult } from './lib/shareCard';

// ── Difficulty ────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  //                                                          basePoints + timeLeft × timeMultiplier = score per Q
  easy:   { timer: 30, maxHints: 3, optionCount: 5, basePoints:  200, timeMultiplier:  20, label: 'Easy',   emoji: '🟢', color: 'text-emerald-400', pill: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300' },
  // max: 200 + 30×20  =   800 / Q  →  8 000 perfect game
  normal: { timer: 15, maxHints: 2, optionCount: 5, basePoints:  500, timeMultiplier:  50, label: 'Normal', emoji: '🟡', color: 'text-amber-400',   pill: 'bg-amber-500/15 border-amber-500/35 text-amber-300'     },
  // max: 500 + 15×50  = 1 250 / Q  → 12 500 perfect game
  hard:   { timer:  8, maxHints: 0, optionCount: 7, basePoints:  800, timeMultiplier: 150, label: 'Hard',   emoji: '🔴', color: 'text-red-400',     pill: 'bg-red-500/15 border-red-500/35 text-red-300'           },
  // max: 800 + 8×150  = 2 000 / Q  → 20 000 perfect game
};
const MAX_SHIELDS = 2;
const REVEAL_PAUSE_MS = 2800;
const DAILY_COUNT = 5;   // Daily Challenge: 5 questions
const GAME_COUNT  = 10;  // Other modes: 10 questions

// ── Flag helpers ──────────────────────────────────────────────────────────────

// Subdivision flags that can't be decoded from emoji codepoints
const SUBDIV_CODE = { 'England': 'gb-eng', 'Scotland': 'gb-sct', 'Wales': 'gb-wls' };

function flagToCode(flag, teamName) {
  if (teamName && SUBDIV_CODE[teamName]) return SUBDIV_CODE[teamName];
  if (!flag) return null;
  try {
    const chars = [...flag];
    if (chars.length >= 2) {
      const a = chars[0].codePointAt(0) - 0x1F1E6;
      const b = chars[1].codePointAt(0) - 0x1F1E6;
      if (a >= 0 && a < 26 && b >= 0 && b < 26)
        return String.fromCharCode(65 + a, 65 + b).toLowerCase();
    }
  } catch { /* ignore */ }
  return null;
}

function FlagImage({ flag, team, cls = '' }) {
  const code = flagToCode(flag, team);
  if (!code) return flag ? <span className="mr-1.5 flex-shrink-0">{flag}</span> : null;
  return (
    <img
      src={`https://flagcdn.com/w20/${code}.png`}
      alt={team || ''}
      className={`h-3.5 w-auto object-cover rounded-[2px] mr-1.5 flex-shrink-0 align-middle ${cls}`}
      onError={e => { e.currentTarget.style.display = 'none' }}
    />
  );
}

function getSavedDifficulty() {
  try { return localStorage.getItem('ndDifficulty') || 'normal'; } catch { return 'normal'; }
}

// ── Flag map (teams data + options-only nations) ──────────────────────────────
// Populated at module level with hard-coded extras; team flags added after lazy load

const FLAG_MAP = {};
Object.assign(FLAG_MAP, {
  'Chile': '🇨🇱', 'Sweden': '🇸🇪', 'Poland': '🇵🇱', 'Serbia': '🇷🇸',
  'Ukraine': '🇺🇦', 'Ghana': '🇬🇭', 'Cameroon': '🇨🇲', 'Nigeria': '🇳🇬',
  'Iran': '🇮🇷', 'Ecuador': '🇪🇨', 'Tunisia': '🇹🇳', 'Qatar': '🇶🇦',
  'Canada': '🇨🇦', 'Costa Rica': '🇨🇷', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Austria': '🇦🇹', 'Czech Republic': '🇨🇿', 'Hungary': '🇭🇺', 'Greece': '🇬🇷',
  'Algeria': '🇩🇿', 'Paraguay': '🇵🇾', 'Peru': '🇵🇪', 'Venezuela': '🇻🇪',
  'Panama': '🇵🇦', 'New Zealand': '🇳🇿', 'China': '🇨🇳', 'Russia': '🇷🇺',
  'Ivory Coast': '🇨🇮', "Côte d'Ivoire": '🇨🇮', 'Mali': '🇲🇱', 'Honduras': '🇭🇳',
  'Bolivia': '🇧🇴', 'Uzbekistan': '🇺🇿', 'Jamaica': '🇯🇲', 'South Africa': '🇿🇦',
  'Romania': '🇷🇴', 'Norway': '🇳🇴', 'Finland': '🇫🇮', 'Ireland': '🇮🇪',
  'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Albania': '🇦🇱', 'North Macedonia': '🇲🇰',
  'Zambia': '🇿🇲', 'Bulgaria': '🇧🇬', 'Iraq': '🇮🇶', 'Irak': '🇮🇶',
});

// ── Region helper ─────────────────────────────────────────────────────────────
// Returns the continental region of a team based on their tournament.
// World Cup = 'world' (any country can appear as option).
// Continental tournaments = restrict options to same continent.

function getRegion(team) {
  const tour = (team?.tournament || '').toLowerCase();
  if (tour.includes('euro') || tour.includes('uefa')) return 'europe';
  if (tour.includes('copa') || tour.includes('conmebol'))  return 'conmebol';
  if (tour.includes('gold cup') || tour.includes('concacaf')) return 'concacaf';
  if (tour.includes('afcon') || tour.includes('africa cup')) return 'africa';
  return 'world'; // World Cup, Asian Cup, current squads → all regions valid
}

// ── Options builder ───────────────────────────────────────────────────────────

function buildOptions(currentTeam, count, _unused, allTeams) {
  if (!allTeams || allTeams.length === 0) return [currentTeam?.team].filter(Boolean);

  const correctAnswer = currentTeam?.team;
  const region = getRegion(currentTeam);

  // Pool: same region for continental tournaments, all teams for World Cup
  const pool = region === 'world'
    ? allTeams
    : allTeams.filter(t => getRegion(t) === region);

  // Collect distinct team names from the pool, excluding the correct answer
  const distractorPool = [...new Set(
    pool.map(t => t.team).filter(name => name !== correctAnswer)
  )].sort(() => Math.random() - 0.5);

  // Fallback: if pool is too small, add from all teams
  const fallbackPool = [...new Set(
    allTeams.map(t => t.team).filter(name => name !== correctAnswer && !distractorPool.includes(name))
  )].sort(() => Math.random() - 0.5);

  const distractors = distractorPool.slice(0, count - 1);
  if (distractors.length < count - 1) {
    distractors.push(...fallbackPool.slice(0, count - 1 - distractors.length));
  }

  return [correctAnswer, ...distractors];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTournamentHeader(team) {
  if (team.mode === 'iconic') return { icon: '🏆', text: team.tournament };
  return { icon: '🌍', text: 'Road to World Cup 2026' };
}

function calcPoints(secondsLeft, cfg) {
  return cfg.basePoints + (secondsLeft * cfg.timeMultiplier);
}

function cleanName(n) {
  return n.replace(/\s*\(.*?\)\s*$/, '').replace(/\s+\d{2,4}$/, '');
}

function getInitials(name) {
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase();
}

// Seeded PRNG for Daily Challenge
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return h;
}
// getDailyTeams() removed — daily logic lives inside modeTeams useMemo (uses state teamsData)

const MODE_META = {
  current:  { icon: '🏟️', key: 'current',  color: 'text-blue-300',    bg: 'bg-blue-500/10 border-blue-500/20',     badge: 'Current' },
  iconic:   { icon: '🏆', key: 'iconic',   color: 'text-amber-300',   bg: 'bg-amber-500/10 border-amber-500/20',    badge: 'Legendary' },
  mixed:    { icon: '🔀', key: 'mixed',    color: 'text-purple-300',  bg: 'bg-purple-500/10 border-purple-500/20',   badge: 'Mixed Legends' },
  daily:    { icon: '📅', key: 'daily',    color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20',  badge: 'Daily' },
  worldcup: { icon: '🌍', key: 'worldcup', color: 'text-yellow-400',  bg: 'from-yellow-500/10 to-transparent',      badge: 'World Cup' },
  euro:     { icon: '🇪🇺', key: 'euro',     color: 'text-blue-400',    bg: 'from-blue-500/10 to-transparent',        badge: 'Euro' },
  conmebol: { icon: '🌎', key: 'conmebol', color: 'text-green-400',   bg: 'from-green-500/10 to-transparent',       badge: 'Copa' },
  concacaf: { icon: '🏆', key: 'concacaf', color: 'text-red-400',     bg: 'from-red-500/10 to-transparent',         badge: 'Gold Cup' },
  afcon:    { icon: '🌍', key: 'afcon',    color: 'text-orange-400',  bg: 'from-orange-500/10 to-transparent',      badge: 'AFCON' },
};

function getSavedLang() {
  try { return localStorage.getItem('ndLang') || 'tr'; } catch { return 'tr'; }
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [lang, setLang] = useState(getSavedLang());
  
  const t = useCallback((path) => {
    const keys = path.split('.');
    let obj = translations[lang];
    for (const key of keys) {
      if (!obj || !obj[key]) return path;
      obj = obj[key];
    }
    return obj;
  }, [lang]);

  const toggleLang = () => {
    const next = lang === 'en' ? 'tr' : 'en';
    setLang(next);
    try { localStorage.setItem('ndLang', next); } catch {}
  };
  // ── Lazy-load team data (served from /public, not bundled) ──────────────────
  const [teamsData, setTeamsData] = useState([]);
  useEffect(() => {
    fetch('/national_teams.json')
      .then(r => r.json())
      .then(data => {
        setTeamsData(data);
        // Populate FLAG_MAP with team flags from loaded data
        data.forEach(t => { FLAG_MAP[t.team] = t.flag; });
      });
  }, []);

  const [screen, setScreen]               = useState('start');
  const [mode, setMode]                   = useState(null);
  const [difficulty, setDifficulty]       = useState(getSavedDifficulty);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed]       = useState(false);
  const [score, setScore]                 = useState(0);
  const [streak, setStreak]               = useState(0);
  const [bestStreak, setBestStreak]       = useState(0);
  const [correctCount, setCorrectCount]   = useState(0);
  const [missedTeams, setMissedTeams]     = useState([]);
  const [timeLeft, setTimeLeft]           = useState(15);
  const [timedOut, setTimedOut]           = useState(false);
  const [muted, setMuted]                 = useState(!isSoundOn());
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [shareStatus, setShareStatus]     = useState(null);
  const [hintsUsed, setHintsUsed]         = useState(0);
  const [hintTexts, setHintTexts]         = useState([]);
  const [lastPts, setLastPts]             = useState(null);
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const [showStats, setShowStats]         = useState(false);
  const [showSaveScore, setShowSaveScore]     = useState(false);
  const [showGlobalLB, setShowGlobalLB]       = useState(false);
  const [questionResults, setQuestionResults] = useState([]); // [{correct, timeLeft}]
  const [shieldOverlay, setShieldOverlay]     = useState(false);
  const [gameId, setGameId]                   = useState(0); // Used to reshuffle teams on Play Again

  // Shield system
  const [shields, setShields]             = useState(0);
  const [shieldFlash, setShieldFlash]     = useState(null); // 'earned' | 'used' | null

  const timerRef  = useRef(null);
  const autoRef   = useRef(null);
  const scoreRef  = useRef(0);
  const shieldsRef = useRef(0);
  const hintMultRef = useRef(1); // multiplier applied to this question's points (1 → 0.5 → 0.25)

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { shieldsRef.current = shields; }, [shields]);

  const diffConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;

  // Persist difficulty choice
  const handleDifficultyChange = (d) => {
    setDifficulty(d);
    try { localStorage.setItem('ndDifficulty', d); } catch {}
  };

  // ── Team data ───────────────────────────────────────────────────────────────
  // ── Teams logic ──────────────────────────────────────────────────────────────
  
  const allTeamsByLeague = useMemo(() => {
    const map = {};
    teamsData.forEach(t => {
      if (!map[t.league]) map[t.league] = new Set();
      map[t.league].add(t.team);
    });
    return map;
  }, []);

  const allTeamNames = useMemo(() => [...new Set(teamsData.map(t => t.team))], [teamsData]);

  const modeTeams = useMemo(() => {
    let filtered = [];
    if (mode === 'daily') {
      // UTC date → same 5 questions for everyone worldwide, resets at UTC midnight
      const utcDate = new Date().toISOString().split('T')[0]; // e.g. "2025-03-28"
      const rng = mulberry32(hashStr(utcDate));
      const shuffled = [...teamsData];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      filtered = shuffled.slice(0, DAILY_COUNT);
    } else if (mode === 'current') {
      filtered = teamsData.filter(t => t.mode !== 'iconic');
    } else if (mode === 'mixed') {
      // User requested only historic/iconic squads in Mixed Legends, excluding 2026/current
      filtered = teamsData.filter(t => t.mode === 'iconic' && t.year !== 2026);
    } else if (mode) {
      // tournament-based modes (euro, worldcup, etc.)
      const modeMap = {
        'worldcup': 'World Cup',
        'euro':     'Euro',
        'conmebol': 'Copa',
        'concacaf': 'Gold Cup',
        'afcon':    'AFCON'
      };
      const search = modeMap[mode] || mode;
      filtered = teamsData.filter(t => t.mode === 'iconic' && t.tournament?.toLowerCase().includes(search.toLowerCase()));
    }
    
    // Shuffle and pick GAME_COUNT
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    return filtered.slice(0, GAME_COUNT);
  }, [mode, gameId, teamsData]);

  const currentTeam = modeTeams[currentIndex] || null;
  const isLastTeam  = currentIndex === modeTeams.length - 1;

  // Build shuffled options (Hard mode gets 7)
  const shuffledOptions = useMemo(() => {
    if (!currentTeam) return [];
    const arr = buildOptions(currentTeam, diffConfig.optionCount, null, teamsData);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentTeam?.id, difficulty, teamsData]);

  // ── Timer ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (screen !== 'game' || isRevealed || !currentTeam) return;
    setTimeLeft(diffConfig.timer);
    setTimedOut(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, currentIndex, isRevealed, currentTeam, difficulty]);

  // Tension ticks — last 5 seconds
  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 5 && !isRevealed && !muted) playTick();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Time-out auto-reveal
  useEffect(() => {
    if (timeLeft === 0 && !isRevealed && screen === 'game') {
      clearInterval(timerRef.current);
      setTimedOut(true);
      setIsRevealed(true);
      setSelectedAnswer(null);
      setStreak(0);
      setQuestionResults(r => [...r, { correct: false, timeLeft: 0 }]);
      if (currentTeam?.funFact) setMissedTeams(m => [...m, currentTeam]);
      if (!muted) playFail();
      autoRef.current = setTimeout(() => advanceOrEnd(), REVEAL_PAUSE_MS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearTimeout(autoRef.current);
  }, []);

  // ── Confetti ─────────────────────────────────────────────────────────────────

  const fireConfetti = useCallback(() => {
    const d = {
      spread: 65, ticks: 90, gravity: 0.85, decay: 0.91, startVelocity: 32,
      colors: ['#f0c040', '#10b981', '#3b82f6', '#f43f5e', '#a855f7', '#ffffff'],
    };
    confetti({ ...d, particleCount: 45, origin: { x: 0.28, y: 0.65 }, angle: 60 });
    confetti({ ...d, particleCount: 45, origin: { x: 0.72, y: 0.65 }, angle: 120 });
  }, []);

  // ── Advance / End ─────────────────────────────────────────────────────────────

  const advanceOrEnd = useCallback(() => {
    clearTimeout(autoRef.current);
    clearInterval(timerRef.current);
    if (currentIndex < modeTeams.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
      setTimedOut(false);
      setHintsUsed(0);
      setHintTexts([]);
      setLastPts(null);
      setShieldFlash(null);
      hintMultRef.current = 1;
    } else {
      const finalScore = scoreRef.current;
      recordGame({
        mode, score: finalScore, correctCount,
        totalQuestions: modeTeams.length, bestAnswerStreak: bestStreak, difficulty,
      });
      saveScore({ mode, score: finalScore, correctCount, totalQuestions: modeTeams.length, difficulty });
      if (mode === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        try { localStorage.setItem('ndDailyResult', JSON.stringify({ date: today, score: finalScore, correctCount })); } catch {}
      }
      if (!muted) {
        if (correctCount > modeTeams.length / 2) playComplete();
        else playGameOver();
      }
      setShowEndScreen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, modeTeams.length, mode, correctCount, bestStreak, muted]);

  // ── Handle Answer ─────────────────────────────────────────────────────────────

  const handleAnswer = useCallback((answer) => {
    if (isRevealed) return;
    clearInterval(timerRef.current);
    setSelectedAnswer(answer);
    setIsRevealed(true);
    const correct = answer === currentTeam?.team;
    setQuestionResults(r => [...r, { correct, timeLeft }]);

    if (correct) {
      const pts = Math.floor(calcPoints(timeLeft, diffConfig) * hintMultRef.current);
      setScore(s => s + pts);
      setLastPts(pts);
      setCorrectCount(c => c + 1);
      setStreak(s => {
        const n = s + 1;
        setBestStreak(b => Math.max(b, n));
        // Earn a shield every 3 streak (max 2)
        if (n % 3 === 0 && shieldsRef.current < MAX_SHIELDS) {
          setShields(sh => Math.min(sh + 1, MAX_SHIELDS));
          setShieldFlash('earned');
          setShieldOverlay(true);
          setTimeout(() => { setShieldFlash(null); setShieldOverlay(false); }, 1800);
        }
        return n;
      });
      if (!muted) { playDing(); setTimeout(playStadiumSound, 220); }
      fireConfetti();
      autoRef.current = setTimeout(advanceOrEnd, REVEAL_PAUSE_MS);
    } else {
      if (currentTeam?.funFact) setMissedTeams(m => [...m, currentTeam]);
      // Wrong answer — check for shield
      if (shieldsRef.current > 0) {
        setShields(sh => sh - 1);
        setShieldFlash('used');
        setTimeout(() => setShieldFlash(null), 1800);
        // Streak is PRESERVED by shield — don't reset
      } else {
        setStreak(0);
      }
      if (!muted) playFail();
      // ✅ Feature 1: Auto-advance on wrong answer too
      autoRef.current = setTimeout(advanceOrEnd, REVEAL_PAUSE_MS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, currentTeam, timeLeft, muted, fireConfetti, advanceOrEnd]);

  // ── Hint ───────────────────────────────────────────────────────────────────────

  const handleHint = useCallback(() => {
    if (!currentTeam || isRevealed || hintsUsed >= diffConfig.maxHints) return;
    hintMultRef.current = hintMultRef.current * 0.5; // halve THIS question's points only
    const next = hintsUsed + 1;
    setHintsUsed(next);
    if (next === 1) {
      setHintTexts([`${t('game.league')}: ${currentTeam.league || 'Unknown'}`]);
    } else {
      setHintTexts(prev => [...prev, `${t('game.captain')}: ${getInitials(currentTeam.captain || 'Unknown')}`]);
    }
  }, [currentTeam, isRevealed, hintsUsed, diffConfig.maxHints, t]);

  // ── Mode select ───────────────────────────────────────────────────────────────

  const handleSelectMode = (m) => {
    if (m === 'logoAudit') {
      setScreen('logoAudit');
      return;
    }
    setMode(m); setScreen('game'); setCurrentIndex(0);
    setGameId(prev => prev + 1);
    setSelectedAnswer(null); setIsRevealed(false);
    setScore(0); setStreak(0); setBestStreak(0); setCorrectCount(0);
    setTimedOut(false); setShowEndScreen(false); setShareStatus(null); setMissedTeams([]);
    setHintsUsed(0); setHintTexts([]); setLastPts(null);
    setShields(0); setShieldFlash(null);
    setQuestionResults([]); setShieldOverlay(false);
    hintMultRef.current = 1;
  };

  // ── Back ───────────────────────────────────────────────────────────────────────

  const handleBack = () => {
    clearTimeout(autoRef.current); clearInterval(timerRef.current);
    setScreen('start'); setMode(null); setCurrentIndex(0);
    setSelectedAnswer(null); setIsRevealed(false); setScore(0);
    setStreak(0); setBestStreak(0); setCorrectCount(0);
    setTimedOut(false); setShowEndScreen(false); setShareStatus(null); setMissedTeams([]);
    setShowSaveScore(false); setShowGlobalLB(false);
    setHintsUsed(0); setHintTexts([]); setLastPts(null);
    setShields(0); setShieldFlash(null);
    setQuestionResults([]); setShieldOverlay(false);
  };

  // ── Mute ───────────────────────────────────────────────────────────────────────

  const handleToggleMute = () => {
    const next = toggleSound();
    setMuted(!next);
  };

  // ── Share ─────────────────────────────────────────────────────────────────────

  const handleShare = async () => {
    setShareStatus('loading');
    const result = await shareResult({
      mode, score, correctCount, totalQuestions: modeTeams.length, bestStreak,
      difficulty, questionResults,
    });
    setShareStatus(result);
    if (result === 'copied') setTimeout(() => setShareStatus(null), 2500);
  };

  // ── Start Screen ──────────────────────────────────────────────────────────────

  if (screen === 'start') {
    return (
      <>
        <StartScreen
          onSelectMode={handleSelectMode}
          onShowLeaderboard={() => setShowScoreBoard(true)}
          onShowGlobalLeaderboard={() => setShowGlobalLB(true)}
          onShowStats={() => setShowStats(true)}
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          lang={lang}
          toggleLang={toggleLang}
          t={t}
        />
        {showScoreBoard && <ScoreBoard onClose={() => setShowScoreBoard(false)} t={t} lang={lang} />}
        {showStats      && <StatsModal onClose={() => setShowStats(false)} t={t} lang={lang} />}
        {showGlobalLB   && <GlobalLeaderboard onClose={() => setShowGlobalLB(false)} t={t} />}
      </>
    );
  }

  // ── End Screen ────────────────────────────────────────────────────────────────

  if (showEndScreen) {
    const total = modeTeams.length;
    const pct   = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '⚽' : '😅';
    const meta  = MODE_META[mode] || MODE_META.mixed;

    const shareLabel = shareStatus === 'loading' ? t('end.loading')
      : shareStatus === 'shared'     ? t('end.shared')
      : shareStatus === 'copied'     ? t('end.copied')
      : shareStatus === 'downloaded' ? t('end.downloaded')
      : t('end.share');

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-10 gap-5">
        <div className="text-6xl animate-bounce-in">{emoji}</div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <h1 className="text-3xl font-black text-white leading-tight">
            {mode === 'daily' ? t('end.dailyComplete') : `${t('start.' + (meta.key || 'mixed'))} ${t('end.complete')}`}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}<span className={diffConfig.color}>{diffConfig.emoji} {diffConfig.label}</span>
          </p>
        </div>

        <div
          className="animate-card-reveal w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900
            border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
          style={{ animationDelay: '150ms' }}
        >
          <div className={`px-5 py-2.5 border-b border-slate-700/40 ${meta.bg}`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>{meta.badge}</span>
          </div>

          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-4xl font-black text-[var(--accent-gold)] tabular-nums animate-score-count">
                  {score.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t('end.totalScore')}</p>
              </div>
              <div className="w-px h-12 bg-slate-700/50" />
              <div className="text-center flex-1">
                <p className="text-4xl font-black text-emerald-400">{correctCount}/{total}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t('end.correct')}</p>
              </div>
              <div className="w-px h-12 bg-slate-700/50" />
              <div className="text-center flex-1">
                <p className="text-4xl font-black text-orange-400">🔥{bestStreak}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t('end.bestStreak')}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>{t('end.accuracy')}</span>
                <span className="font-bold text-white">{pct}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            {/* Question result grid */}
            {questionResults.length > 0 && (
              <div className="pt-2 border-t border-slate-700/30">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 text-center">{t('end.questions')}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {questionResults.map((r, i) => (
                    <span
                      key={i}
                      className={`text-xs w-7 h-7 rounded-md flex items-center justify-center font-bold
                        ${r.correct
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/25'
                        }`}
                    >
                      {r.correct ? '✓' : '✗'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Fun Fact Card (1 only) ── */}
        {(() => {
          const teamsWithFacts = missedTeams.filter(t => t.funFact);
          const isWrong = teamsWithFacts.length > 0;
          // Wrong: pick one random missed team with a fact
          // Correct: pick one random team from the round with a fact
          const pool = isWrong
            ? teamsWithFacts
            : modeTeams.filter(t => t.funFact);
          if (pool.length === 0) return null;
          const factTeam = pool[Math.floor(Math.random() * pool.length)];
          return (
            <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/20
                bg-gradient-to-br from-amber-950/60 to-[#0d0800] p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 text-xl mt-0.5">💡</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/60">
                        {isWrong ? t('end.wrongFact') : t('end.didYouKnow')}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300/90">
                        {factTeam.team} {factTeam.year}
                      </span>
                    </div>
                    <p className="text-xs text-white/75 leading-relaxed">{factTeam.funFact}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              </div>
            </div>
          );
        })()}

        <div className="flex flex-col gap-3 w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              disabled={shareStatus === 'loading'}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm cursor-pointer
                bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
                hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-emerald-500/20
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {shareLabel}
            </button>
            <button
              onClick={() => setShowSaveScore(true)}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm cursor-pointer
                bg-gradient-to-r from-amber-500 to-amber-600 text-white
                hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-amber-500/20"
            >
              🏅 {t('save.submit')}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowEndScreen(false); handleSelectMode(mode); }}
              className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer
                bg-white/5 border border-white/10 text-white
                hover:bg-white/10 hover:border-white/20 transition-all"
            >
              🔄 {t('end.playAgain')}
            </button>
            {/* Logo Audit Toggle (Hidden/Dev only) */}
            <button
              onClick={() => setScreen('logoAudit')}
              className="absolute bottom-4 right-4 opacity-10 hover:opacity-100 text-[10px] text-slate-500"
            >
              Audit
            </button>
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer
                bg-white/5 border border-white/10 text-[var(--text-secondary)]
                hover:bg-white/10 hover:text-white transition-all"
            >
              ← {t('end.menu')}
            </button>
          </div>

          <button
            onClick={() => setShowGlobalLB(true)}
            className="w-full py-2.5 rounded-xl font-semibold text-xs cursor-pointer
              bg-white/3 border border-white/8 text-slate-500
              hover:bg-white/8 hover:text-slate-300 transition-all"
          >
            🌍 {t('globalLB.title')}
          </button>
        </div>

        {showSaveScore && (
          <SaveScoreModal
            score={score}
            correctCount={correctCount}
            totalQuestions={modeTeams.length}
            difficulty={difficulty}
            mode={mode}
            onClose={() => setShowSaveScore(false)}
            t={t}
          />
        )}
        {showGlobalLB && (
          <GlobalLeaderboard onClose={() => setShowGlobalLB(false)} t={t} />
        )}
      </div>
    );
  }

  // ── Guard ─────────────────────────────────────────────────────────────────────

  if (!currentTeam) return (
    <div className="min-h-dvh flex items-center justify-center">
      <p className="text-[var(--text-secondary)]">{t('common.error')}</p>
    </div>
  );

  // ── Game UI ───────────────────────────────────────────────────────────────────

  const isCorrect        = selectedAnswer === currentTeam.team;
  const isShieldSave     = isRevealed && !isCorrect && !timedOut && shieldFlash === null && shields >= 0
                           && selectedAnswer && selectedAnswer !== currentTeam.team;
  const tournamentHeader = getTournamentHeader(currentTeam);
  const meta             = MODE_META[mode] || MODE_META.mixed;
  const timerPct         = (timeLeft / diffConfig.timer) * 100;
  const timerColor       = timeLeft > (diffConfig.timer * 0.45) ? 'bg-emerald-500'
                         : timeLeft > (diffConfig.timer * 0.2)  ? 'bg-amber-400'
                         : 'bg-red-500';
  const showSquad        = isRevealed && (isCorrect || timedOut);

  const posGroups = [
    { label: 'GK',  players: currentTeam.players.filter(p => p.position === 'GK')  },
    { label: 'DEF', players: currentTeam.players.filter(p => p.position === 'DEF') },
    { label: 'MID', players: currentTeam.players.filter(p => p.position === 'MID') },
    { label: 'FWD', players: currentTeam.players.filter(p => p.position === 'FWD') },
  ];

  // Shield flash message (shown inside feedback area)
  const shieldMessage = shieldFlash === 'earned'
    ? '🛡️ Shield earned! Keep it up!'
    : shieldFlash === 'used'
    ? '🛡️ Shield activated! Streak saved!'
    : null;

  return (
    <div className="min-h-dvh flex flex-col">

      {/* ── Timer Bar ── */}
      <div className="h-1.5 w-full bg-white/5">
        <div className={`h-full ${timerColor} transition-all duration-1000 ease-linear`} style={{ width: `${timerPct}%` }} />
      </div>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title={t('common.back')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${meta.bg} ${meta.color}`}>
              {meta.badge}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 font-mono">
              {currentIndex + 1} / {modeTeams.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 h-4">
            {streak > 0 && (
              <span key={streak} className="text-[10px] text-orange-400 font-bold animate-streak-pop">
                🔥 {streak}
              </span>
            )}
            {shields > 0 && (
              <span key={`shield-${shields}`} className="text-[10px] text-cyan-400 font-bold flex gap-0.5">
                {'🛡️'.repeat(shields)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="text-base cursor-pointer hover:scale-110 transition-transform"
            title={muted ? t('game.unmute') : t('game.mute')}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <span className={`text-sm font-mono font-bold tabular-nums ${
            timeLeft > diffConfig.timer * 0.45 ? 'text-emerald-400'
            : timeLeft > diffConfig.timer * 0.2 ? 'text-amber-400'
            : 'text-red-400 animate-pulse'
          }`}>
            {isRevealed ? '—' : `${timeLeft}s`}
          </span>
          <div className="flex flex-col items-end">
            <div className="text-sm font-semibold text-[var(--accent-gold)] tabular-nums">⭐ {score.toLocaleString()}</div>
            {lastPts && isRevealed && isCorrect && (
              <div className="text-[10px] text-emerald-400 font-bold animate-score-count leading-none">+{lastPts}</div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center px-4 py-3 gap-3 overflow-y-auto">

        {/* Tournament badge */}
        <div className="animate-fade-in-up w-full max-w-md">
          <div className={`text-center py-2 px-4 rounded-xl border backdrop-blur-sm ${
            currentTeam.mode === 'iconic' ? 'bg-amber-500/8 border-amber-500/15' : 'bg-blue-500/8 border-blue-500/15'
          }`}>
            <p className={`text-sm font-semibold ${currentTeam.mode === 'iconic' ? 'text-amber-300' : 'text-blue-300'}`}>
              {tournamentHeader.icon} {currentTeam.mode === 'iconic' ? (currentTeam.tournament) : (lang === 'tr' ? 'Dünya Kupası 2026 Yolu' : 'Road to World Cup 2026')}
            </p>
          </div>
        </div>

        <FootballPitch team={currentTeam} mode={currentTeam.mode} revealNames={isRevealed} />

        {/* ── Hint System ── */}
        {!isRevealed && (
          <div className="w-full max-w-md flex flex-col items-center gap-2">
            {/* Hard mode: hint button hidden entirely */}
            {diffConfig.maxHints > 0 ? (
              <button
                onClick={handleHint}
                disabled={hintsUsed >= diffConfig.maxHints}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border
                  ${hintsUsed >= diffConfig.maxHints
                    ? 'bg-white/3 border-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02]'
                  }`}
              >
                💡 {hintsUsed === 0 ? t('game.getHint') : `${t('game.getHint')} (${hintsUsed + 1}/${diffConfig.maxHints})`}
                {hintsUsed < diffConfig.maxHints && <span className="text-amber-500/60 text-xs ml-2">(-50% pts)</span>}
              </button>
            ) : (
              <div className="px-4 py-1.5 rounded-lg bg-red-500/8 border border-red-500/15">
                <p className="text-xs text-red-400/70 font-medium">🔴 {lang === 'tr' ? 'Zor mod — ipucu yok' : 'Hard mode — no hints'}</p>
              </div>
            )}
            {hintTexts.length > 0 && (
              <div className="flex flex-col gap-1.5 animate-fade-in-up">
                {hintTexts.map((ht, i) => (
                  <p key={i} className="text-xs text-amber-200/80 bg-amber-500/8 border border-amber-500/15 px-3 py-1.5 rounded-lg text-center">{ht}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Options ── */}
        <div className="w-full max-w-md">
          <p className="text-center text-sm text-[var(--text-secondary)] mb-2">{t('game.reveal')}</p>
          {/* ✅ Feature 3: Hard mode uses 2-column grid for 7 options */}
          <div className={`grid gap-2 ${shuffledOptions.length > 5 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {shuffledOptions.map((option, idx) => {
              let cls = 'w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border animate-bounce-in ';
              if (!isRevealed) {
                cls += 'bg-slate-800/60 border-slate-700/50 text-slate-200 hover:border-emerald-500/50 hover:bg-emerald-500/8 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.12)] active:scale-[0.97]';
              } else if (option === currentTeam.team) {
                cls += 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
              } else if (option === selectedAnswer) {
                cls += 'bg-red-500/20 border-red-500/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)]';
              } else {
                cls += 'bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-default';
              }
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isRevealed}
                  className={`${cls} flex items-center`}
                  style={{ animationDelay: `${idx * 35 + 50}ms` }}
                >
                  <FlagImage flag={FLAG_MAP[option]} team={option} />
                  <span>{option}{isRevealed && option === currentTeam.team && ' ✓'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Feedback ── */}
        {isRevealed && (
          <div className="w-full max-w-md animate-fade-in-up">

            {/* Shield flash banner */}
            {shieldMessage && (
              <div className="animate-bounce-in text-center py-2 px-4 rounded-xl mb-2
                bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-sm font-bold">
                {shieldFlash === 'earned' ? t('game.shieldEarned') : t('game.shieldUsed')}
              </div>
            )}

            {/* Result card */}
            <div className={`animate-card-reveal text-center py-3.5 px-4 rounded-2xl mb-3 border shadow-lg ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/25 shadow-emerald-500/10'
                : 'bg-red-500/10 border-red-500/25 shadow-red-500/10'
            }`}>
              <p className={`text-lg font-bold flex items-center justify-center gap-1.5 flex-wrap ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect
                  ? `🎉 ${t('game.correct')} +${lastPts}`
                  : <>
                      <span>{timedOut ? (lang === 'tr' ? '⏰ Süre bitti! Cevap:' : "⏰ Time's up! It was") : `❌ ${t('game.wrong')}`}</span>
                      <FlagImage flag={currentTeam.flag} team={currentTeam.team} cls="h-4" />
                      <span>{currentTeam.team}</span>
                    </>
                }
              </p>
              {/* ✅ Feature 1: Show auto-advance text for ALL outcomes */}
              <p className="text-xs text-white/35 mt-1">{lang === 'tr' ? '3 saniye içinde geçiliyor…' : 'Auto-advancing in 3s…'}</p>
            </div>

            {/* Squad reveal */}
            {showSquad && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                  📋 {lang === 'tr' ? 'Kadro' : 'Squad'} — {currentTeam.flag} {currentTeam.team} {currentTeam.year}
                </p>
                <div className="space-y-2.5">
                  {posGroups.map(g => g.players.length > 0 && (
                    <div key={g.label}>
                      <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-1">{g.label}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {g.players.map((p, i) => (
                          <span key={i} className="text-xs text-white/80 font-medium">
                            {cleanName(p.name)}
                            {i < g.players.length - 1 && <span className="text-white/20 ml-1">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual skip button (all outcomes — instant advance) */}
            <button
              onClick={advanceOrEnd}
              className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer
                bg-white/5 border border-white/10 text-[var(--text-secondary)]
                hover:bg-white/8 hover:text-white transition-all animate-bounce-in"
              style={{ animationDelay: '200ms' }}
            >
              {isLastTeam ? `Finish (Score: ${score.toLocaleString()})` : 'Next →'}
            </button>
          </div>
        )}

      </main>

      {/* ── Shield Earned Overlay ── */}
      {shieldOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-card-reveal flex flex-col items-center gap-2 bg-black/40 backdrop-blur-sm rounded-3xl px-10 py-8 border border-cyan-500/30">
            <span className="text-6xl animate-bounce-in">🛡️</span>
            <p className="text-2xl font-black text-cyan-300 tracking-tight">Shield Earned!</p>
            <p className="text-sm text-cyan-400/60">Your streak is protected</p>
          </div>
        </div>
      )}
      {screen === 'logoAudit' && (
        <div className="fixed inset-0 z-[200] overflow-auto bg-slate-900">
          <button 
            onClick={() => setScreen('start')}
            className="fixed top-4 right-8 z-[210] bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md"
          >
            Back to Game
          </button>
          <LogoTester />
        </div>
      )}
    </div>
  );
}

export default App;
