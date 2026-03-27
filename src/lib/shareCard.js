// ── National Duty — Canvas Share Card ────────────────────────
// Generates a 1080×1120 PNG and tries native share → download → clipboard fallback.

const MODE_COLORS = {
  current: '#3b82f6',
  iconic:  '#f59e0b',
  mixed:   '#a855f7',
  daily:   '#10b981',
}

const MODE_LABELS = {
  current: 'Current Squads',
  iconic:  'Iconic Squads',
  mixed:   'Mixed Mode',
  daily:   'Daily Challenge',
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export async function generateShareImage({ mode, score, correctCount, totalQuestions, bestStreak, difficulty = 'normal', questionResults = [] }) {
  const S = 1080
  const H = 1120  // canvas height
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const cx = S / 2

  // ── Background ──────────────────────────────────────────────
  const bg = ctx.createRadialGradient(cx, H * 0.3, 0, cx, cx, H * 0.9)
  bg.addColorStop(0, '#0f172a')
  bg.addColorStop(1, '#020617')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, S, H)

  // Mode-colour glow
  const modeColor = MODE_COLORS[mode] || '#10b981'
  const glow = ctx.createRadialGradient(cx, S * 0.45, 0, cx, S * 0.45, 420)
  glow.addColorStop(0, modeColor + '22')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, S, H)

  // Subtle pitch-line grid (decorative)
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 1
  for (let y = 0; y < H; y += 54) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke()
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

  // ── Header ───────────────────────────────────────────────────
  ctx.fillStyle = '#334155'
  ctx.font = `600 38px ${font}`
  ctx.fillText('⚽  NATIONAL DUTY', cx, 108)

  // ── Big emoji ────────────────────────────────────────────────
  const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '⚽' : '😅'
  ctx.font = '180px serif'
  ctx.fillText(emoji, cx, 370)

  // ── Mode badge ───────────────────────────────────────────────
  const bw = 290, bh = 56, bx = cx - bw / 2, by = 410
  drawRoundRect(ctx, bx, by, bw, bh, bh / 2)
  ctx.fillStyle = modeColor + '22'
  ctx.fill()
  drawRoundRect(ctx, bx, by, bw, bh, bh / 2)
  ctx.strokeStyle = modeColor + '55'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = modeColor
  ctx.font = `bold 28px ${font}`
  ctx.fillText(MODE_LABELS[mode] || mode, cx, by + 38)

  // ── Score ────────────────────────────────────────────────────
  const scoreGrad = ctx.createLinearGradient(cx - 300, 0, cx + 300, 0)
  scoreGrad.addColorStop(0, '#f0c040')
  scoreGrad.addColorStop(1, '#f59e0b')
  ctx.fillStyle = scoreGrad
  ctx.font = `bold 158px ${font}`
  ctx.fillText(score.toLocaleString(), cx, 688)

  ctx.fillStyle = '#334155'
  ctx.font = `500 42px ${font}`
  ctx.fillText('P O I N T S', cx, 750)

  // ── Stats row ────────────────────────────────────────────────
  ctx.fillStyle = '#64748b'
  ctx.font = `36px ${font}`
  ctx.fillText(
    `${correctCount} / ${totalQuestions} correct  ·  ${pct}% accuracy  ·  🔥 ${bestStreak}`,
    cx, 854
  )

  // ── Question result grid ─────────────────────────────────────
  if (questionResults.length > 0) {
    ctx.font = '56px serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      questionResults.map(r => r.correct ? '🟩' : '🟥').join(''),
      cx, 890
    )
  }

  // ── Difficulty ───────────────────────────────────────────────
  const diffColors = { easy: '#10b981', normal: '#475569', hard: '#ef4444' }
  const diffLabels = { easy: '🟢 Easy Mode', normal: 'Normal Mode', hard: '🔴 Hard Mode' }
  if (difficulty !== 'normal') {
    ctx.fillStyle = diffColors[difficulty] || diffColors.normal
    ctx.font = `500 30px ${font}`
    ctx.fillText(diffLabels[difficulty] || '', cx, questionResults.length > 0 ? 960 : 900)
  }

  // ── Divider ──────────────────────────────────────────────────
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.beginPath()
  const divY = questionResults.length > 0 ? (difficulty !== 'normal' ? 1010 : 980) : 916
  ctx.moveTo(cx - 200, divY); ctx.lineTo(cx + 200, divY)
  ctx.stroke()

  // ── Brand ────────────────────────────────────────────────────
  ctx.fillStyle = '#334155'
  ctx.font = `32px ${font}`
  ctx.fillText(window.location.host || 'nationalduty.app', cx, divY + 64)

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  )
}

/**
 * Share or download the result card.
 * Returns 'shared' | 'downloaded' | 'copied' | 'failed'
 */
export async function shareResult({ mode, score, correctCount, totalQuestions, bestStreak, difficulty = 'normal', questionResults = [] }) {
  const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '⚽' : '😅'
  const modeLabel = MODE_LABELS[mode] || mode
  const grid = questionResults.length > 0
    ? '\n' + questionResults.map(r => r.correct ? '🟩' : '🟥').join('')
    : ''
  const text = `${emoji} National Duty — ${modeLabel}\n${correctCount}/${totalQuestions} correct · ${score.toLocaleString()} pts · 🔥 ${bestStreak}${grid}\n\n${window.location.origin}`

  try {
    const blob = await generateShareImage({ mode, score, correctCount, totalQuestions, bestStreak, difficulty, questionResults })
    const file = new File([blob], 'national-duty.png', { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text })
      return 'shared'
    }

    if (!navigator.share) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'national-duty-result.png'
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      return 'downloaded'
    }
  } catch { /* fall through */ }

  if (navigator.share) {
    try { await navigator.share({ text }); return 'shared' } catch { /* fall through */ }
  }

  try { await navigator.clipboard.writeText(text); return 'copied' } catch {}
  return 'failed'
}
