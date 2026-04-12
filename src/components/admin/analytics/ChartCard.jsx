import { motion } from 'framer-motion'

export function ChartCard({
  title,
  subtitle,
  children,
  className = '',
  action,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-xl border border-[#333539] bg-[#1e2024] p-6 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="font-['Space_Grotesk'] text-base font-semibold text-[#e2e2e8]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-['Inter'] text-xs text-[#bbc9cf] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}

// Reusable SVG glow filter + gradient defs for Recharts
export function ChartGlowDefs() {
  return (
    <defs>
      {/* Glow filter for lines and bars */}
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Accent area gradient (blue) */}
      <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a4e6ff" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#a4e6ff" stopOpacity={0.02} />
      </linearGradient>

      {/* Success area gradient (green) */}
      <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.02} />
      </linearGradient>

      {/* Bar glow gradient (green) */}
      <linearGradient id="barGlowGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.4} />
      </linearGradient>
    </defs>
  )
}

// Date range pill selector
export function RangeSelector({ value, onChange }) {
  const ranges = [
    { key: '7d', label: '7d' },
    { key: '30d', label: '30d' },
    { key: '90d', label: '90d' },
    { key: 'all', label: 'All' },
  ]

  return (
    <div className="flex gap-1 rounded-lg bg-[#111318] p-1">
      {ranges.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={`px-3 py-1 rounded-md font-['Inter'] text-xs font-medium transition-all ${
            value === r.key
              ? 'bg-[#a4e6ff]/15 text-[#a4e6ff] border border-[#a4e6ff]/30'
              : 'text-[#bbc9cf] hover:text-[#e2e2e8] border border-transparent'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
