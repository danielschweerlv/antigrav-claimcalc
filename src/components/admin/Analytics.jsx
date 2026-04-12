import { motion } from 'framer-motion'
import { ConversionFunnel } from './analytics/ConversionFunnel'
import { TimeSeriesCharts } from './analytics/TimeSeriesCharts'
import { AttorneyScorecard } from './analytics/AttorneyScorecard'
import { CaseTypeBreakdown } from './analytics/CaseTypeBreakdown'
import { TrafficOverview } from './analytics/TrafficOverview'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Analytics() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#e2e2e8]"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Analytics
        </h1>
        <p className="mt-1 text-sm text-[#bbc9cf]">
          Performance metrics and insights
        </p>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Conversion Funnel — full width */}
        <motion.div variants={fadeUp}>
          <ConversionFunnel />
        </motion.div>

        {/* Time Series Charts — full width, 3-col grid inside */}
        <motion.div variants={fadeUp}>
          <TimeSeriesCharts />
        </motion.div>

        {/* Attorney Scorecard — full width */}
        <motion.div variants={fadeUp}>
          <AttorneyScorecard />
        </motion.div>

        {/* Bottom row: Case Types + Traffic */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CaseTypeBreakdown />
          <TrafficOverview />
        </motion.div>
      </motion.div>
    </div>
  )
}
