/**
 * High-quality SVG placeholder components for the gaming UI.
 */

/** Club crest shield — used when all logo sources fail */
export function ClubShield({ clubName, colorClass = 'from-emerald-500 to-teal-600' }) {
  const initials = clubName
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 80 96" className="w-full h-full drop-shadow-lg">
        {/* Shield shape */}
        <path
          d="M40 4 L72 18 L72 52 Q72 80 40 92 Q8 80 8 52 L8 18 Z"
          fill="url(#shieldGrad)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        {/* Inner highlight */}
        <path
          d="M40 10 L66 22 L66 50 Q66 74 40 86 Q14 74 14 50 L14 22 Z"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        {/* Club initials */}
        <text
          x="40"
          y="58"
          textAnchor="middle"
          fill="white"
          fontSize="20"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1"
        >
          {initials}
        </text>
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
