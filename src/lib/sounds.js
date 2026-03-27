// ── Web Audio API sound system ──────────────────────────────────
// No external files — everything synthesised.
// Mute preference persisted in localStorage so it survives refresh.

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Low-level tone helper */
function tone({ freq, endFreq, type = 'sine', dur = 0.18, vol = 0.2, delay = 0 }) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    const t = c.currentTime + delay
    osc.frequency.setValueAtTime(freq, t)
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur)
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
    osc.start(t)
    osc.stop(t + dur + 0.01)
  } catch { /* AudioContext might not be available */ }
}

// ── Persistent mute preference ────────────────────────────────
const SOUND_KEY = 'nationalDuty_sounds'
export const isSoundOn = () => localStorage.getItem(SOUND_KEY) !== 'off'
export function toggleSound() {
  const next = !isSoundOn()
  localStorage.setItem(SOUND_KEY, next ? 'on' : 'off')
  return next
}

// ── Sound effects ─────────────────────────────────────────────

/** Correct answer — rising two-note chime */
export function playDing() {
  if (!isSoundOn()) return
  tone({ freq: 440, endFreq: 660, dur: 0.18, vol: 0.2 })
  tone({ freq: 660, endFreq: 880, dur: 0.15, vol: 0.18, delay: 0.15 })
}

/** Wrong answer — falling sawtooth thud */
export function playFail() {
  if (!isSoundOn()) return
  tone({ freq: 280, endFreq: 140, type: 'sawtooth', dur: 0.3, vol: 0.18 })
}

/** Timer tension tick — last 5 seconds */
export function playTick() {
  if (!isSoundOn()) return
  tone({ freq: 900, dur: 0.06, vol: 0.1, type: 'square' })
}

/** Crowd cheer — filtered noise burst on correct answer */
export function playStadiumSound() {
  if (!isSoundOn()) return
  try {
    const c = getCtx()
    const t = c.currentTime
    const bufSize = c.sampleRate * 1.5
    const buf = c.createBuffer(1, bufSize, c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

    const noise = c.createBufferSource()
    noise.buffer = buf

    const filter = c.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(600, t)
    filter.frequency.linearRampToValueAtTime(900, t + 0.6)

    const gain = c.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.18, t + 0.3)
    gain.gain.linearRampToValueAtTime(0, t + 1.5)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(c.destination)
    noise.start(t)
  } catch { /* ignore */ }
}

/** Game complete fanfare — 4-note ascending arpeggio */
export function playComplete() {
  if (!isSoundOn()) return
  ;[523, 659, 784, 1047].forEach((f, i) =>
    tone({ freq: f, dur: 0.2, vol: 0.18, delay: i * 0.1 })
  )
}

/** Game over — descending drone */
export function playGameOver() {
  if (!isSoundOn()) return
  tone({ freq: 330, endFreq: 165, type: 'square', dur: 0.5, vol: 0.18 })
}
