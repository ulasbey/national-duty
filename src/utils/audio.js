// Web Audio API sound effects — no external files needed
const AC = window.AudioContext || window.webkitAudioContext;
let ctx = null;
function getCtx() {
    if (!ctx) ctx = new AC();
    // Resume on user gesture (autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

export function playDing() {
    const c = getCtx(), t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g); g.connect(c.destination);
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.1);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t); osc.stop(t + 0.5);
}

export function playFail() {
    const c = getCtx(), t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g); g.connect(c.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.4);
}

export function playTick() {
    const c = getCtx(), t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g); g.connect(c.destination);
    osc.frequency.setValueAtTime(1000, t);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.start(t); osc.stop(t + 0.06);
}

export function playStadiumSound() {
    const c = getCtx(), t = c.currentTime;
    const g = c.createGain();

    // Create a noise buffer
    const bufferSize = c.sampleRate * 2; // 2 seconds
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;

    // Filter the noise to sound like crowd cheer
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 1);
    filter.frequency.exponentialRampToValueAtTime(300, t + 2);

    noise.connect(filter);
    filter.connect(g);
    g.connect(c.destination);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.2, t + 0.5);
    g.gain.linearRampToValueAtTime(0, t + 2);

    noise.start(t);
}
