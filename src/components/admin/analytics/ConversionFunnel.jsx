import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Loader2 } from 'lucide-react'
import { AnimatedCounter } from './AnimatedCounter'
import { ChartCard } from './ChartCard'
import { fetchFunnelData } from '@/lib/analytics-helpers'

// 5-stop color gradient: #a4e6ff → #7dd3fc → #38bdf8 → #22c55e → #4ADE80
const STAGE_COLORS = [
  '#a4e6ff',
  '#7dd3fc',
  '#38bdf8',
  '#22c55e',
  '#4ADE80',
]

// Clip-path for a left-open chevron/trapezoid pointing right
// The taper is 10px on each vertical edge
function getChevronClipPath() {
  return 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 16px 50%)'
}

// For the first bar, the left side is straight (no indent)
function getFirstChevronClipPath() {
  return 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)'
}

export function ConversionFunnel() {
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFunnelData().then((data) => {
      setStages(data ?? [])
      setLoading(false)
    })
  }, [])

  const maxCount = stages.length > 0 ? stages[0]?.count ?? 1 : 1
  const firstCount = maxCount || 1
  const lastCount = stages.length > 0 ? stages[stages.length - 1]?.count ?? 0 : 0
  const overallRate = firstCount > 0 ? (lastCount / firstCount) * 100 : 0

  return (
    <ChartCard title="Conversion Funnel" index={0}>
      {/* Loading state */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-16"
          >
            <Loader2
              className="animate-spin text-[#a4e6ff]"
              size={28}
              strokeWidth={1.5}
            />
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && stages.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-2"
          >
            <span className="font-['Space_Grotesk'] text-2xl text-[#333539]">∅</span>
            <p className="font-['Manrope'] text-sm text-[#bbc9cf]">No leads yet</p>
          </motion.div>
        )}

        {/* Funnel */}
        {!loading && stages.length > 0 && (
          <motion.div
            key="funnel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            {stages.map((stage, i) => {
              const widthPct = firstCount > 0 ? (stage.count / firstCount) * 100 : 0
              const color = STAGE_COLORS[i] ?? STAGE_COLORS[STAGE_COLORS.length - 1]
              const isFirst = i === 0
              const clipPath = isFirst ? getFirstChevronClipPath() : getChevronClipPath()

              return (
                <div key={stage.label} className="flex items-center gap-2">
                  {/* Stage bar */}
                  <div className="flex-1 relative" style={{ minHeight: 52 }}>
                    {/* Track (background) */}
                    <div
                      className="absolute inset-0 rounded-sm opacity-10"
                      style={{ backgroundColor: color }}
                    />

                    {/* Animated fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.15,
                        ease: [0.34, 1.06, 0.64, 1],
                      }}
                      style={{
                        clipPath,
                        backgroundColor: color,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        minWidth: widthPct > 0 ? 120 : 0,
                        overflow: 'hidden',
                      }}
                      whileHover={{
                        boxShadow: '0 0 20px rgba(164,230,255,0.3)',
                        filter: 'brightness(1.15)',
                      }}
                      className="transition-shadow duration-200"
                    />

                    {/* Content row — sits above the fill */}
                    <div className="relative z-10 flex items-center h-[52px] px-4 gap-3">
                      {/* Stage label */}
                      <span
                        className="font-['Inter'] text-xs font-semibold uppercase tracking-wider shrink-0"
                        style={{ color: widthPct > 20 ? '#111318' : '#e2e2e8' }}
                      >
                        {stage.label}
                      </span>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Count — center of the bar */}
                      <span style={{ color: widthPct > 20 ? '#111318' : '#e2e2e8' }}>
                        <AnimatedCounter
                          value={stage.count}
                          className="text-sm font-bold"
                        />
                      </span>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Drop-off */}
                      {stage.dropOff != null ? (
                        <span className="font-['Inter'] text-xs text-[#bbc9cf] shrink-0">
                          ↓ {stage.dropOff}%
                        </span>
                      ) : (
                        <span className="font-['Inter'] text-xs text-[#bbc9cf]/40 shrink-0">
                          —
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chevron separator (not after last stage) */}
                  {i < stages.length - 1 && (
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-[#333539]"
                      strokeWidth={2}
                    />
                  )}
                </div>
              )
            })}

            {/* Overall conversion rate */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stages.length * 0.15 + 0.2, duration: 0.4 }}
              className="mt-6 pt-5 border-t border-[#333539] flex items-end justify-between gap-4"
            >
              <div>
                <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#bbc9cf] mb-1">
                  Overall Conversion Rate
                </p>
                <p className="font-['Manrope'] text-xs text-[#bbc9cf]">
                  {lastCount.toLocaleString()} converted from {firstCount.toLocaleString()} leads
                </p>
              </div>

              <div className="flex items-baseline gap-1 shrink-0">
                <AnimatedCounter
                  value={overallRate}
                  suffix="%"
                  decimals={1}
                  className="font-['Space_Grotesk'] text-4xl font-bold text-[#4ADE80]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChartCard>
  )
}
