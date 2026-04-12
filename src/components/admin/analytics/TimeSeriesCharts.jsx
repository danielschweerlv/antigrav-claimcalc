import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { ChartCard, ChartGlowDefs, RangeSelector } from './ChartCard'
import {
  fetchTimeSeriesData,
  fetchRevenueTimeSeries,
  fetchConversionTimeSeries,
  CHART_THEME,
} from '@/lib/analytics-helpers'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, valuePrefix = '', valueSuffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#333539] border-l-2 border-l-[#a4e6ff] bg-[#1e2024] px-3 py-2 shadow-lg">
      <p className="font-['Inter'] text-xs text-[#bbc9cf]">{label}</p>
      <p className="font-['Space_Grotesk'] text-sm font-semibold text-[#e2e2e8]">
        {valuePrefix}
        {typeof payload[0].value === 'number'
          ? payload[0].value.toLocaleString()
          : payload[0].value}
        {valueSuffix}
      </p>
    </div>
  )
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────

function ChartSpinner() {
  return (
    <div className="flex min-h-[250px] items-center justify-center">
      <svg
        className="h-6 w-6 animate-spin text-[#a4e6ff]/60"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  )
}

// ─── Axis tick style helpers ──────────────────────────────────────────────────

const TICK_STYLE = {
  fontSize: 11,
  fontFamily: 'Inter, sans-serif',
  fill: '#bbc9cf',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TimeSeriesCharts() {
  const [range, setRange] = useState('30d')

  const [leadsData, setLeadsData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [conversionData, setConversionData] = useState([])

  const [loadingLeads, setLoadingLeads] = useState(true)
  const [loadingRevenue, setLoadingRevenue] = useState(true)
  const [loadingConversion, setLoadingConversion] = useState(true)

  useEffect(() => {
    setLoadingLeads(true)
    setLoadingRevenue(true)
    setLoadingConversion(true)

    fetchTimeSeriesData(range)
      .then((d) => setLeadsData(d ?? []))
      .catch(() => setLeadsData([]))
      .finally(() => setLoadingLeads(false))

    fetchRevenueTimeSeries(range)
      .then((d) => setRevenueData(d ?? []))
      .catch(() => setRevenueData([]))
      .finally(() => setLoadingRevenue(false))

    fetchConversionTimeSeries(range)
      .then((d) => setConversionData(d ?? []))
      .catch(() => setConversionData([]))
      .finally(() => setLoadingConversion(false))
  }, [range])

  // Average conversion rate for the ReferenceLine
  const avgConversion = useMemo(() => {
    if (!conversionData.length) return 0
    const sum = conversionData.reduce((acc, d) => acc + (d.rate ?? 0), 0)
    return parseFloat((sum / conversionData.length).toFixed(2))
  }, [conversionData])

  const rangeSelector = (
    <RangeSelector value={range} onChange={setRange} />
  )

  return (
    <div className="space-y-4">
      {/* Shared header with range selector */}
      <div className="flex items-center justify-between">
        <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e2e2e8]">
          Trends
        </h2>
        {rangeSelector}
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Chart 1: Leads Over Time ── */}
        <ChartCard title="Leads Over Time" index={0}>
          {loadingLeads ? (
            <ChartSpinner />
          ) : (
            <div className="min-h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={leadsData}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <defs>
                    <ChartGlowDefs />
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a4e6ff" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#a4e6ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_THEME.grid}
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#333539', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#a4e6ff"
                    strokeWidth={2}
                    fill="url(#leadsGradient)"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        {/* ── Chart 2: Revenue ── */}
        <ChartCard title="Revenue" index={1}>
          {loadingRevenue ? (
            <ChartSpinner />
          ) : (
            <div className="min-h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={revenueData}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <defs>
                    <ChartGlowDefs />
                    <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_THEME.grid}
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip valuePrefix="$" />}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="url(#revenueBarGradient)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        {/* ── Chart 3: Conversion Rate ── */}
        <ChartCard title="Conversion Rate" index={2}>
          {loadingConversion ? (
            <ChartSpinner />
          ) : (
            <div className="min-h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={conversionData}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <defs>
                    <ChartGlowDefs />
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_THEME.grid}
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    content={<CustomTooltip valueSuffix="%" />}
                    cursor={{ stroke: '#333539', strokeWidth: 1 }}
                  />
                  {avgConversion > 0 && (
                    <ReferenceLine
                      y={avgConversion}
                      stroke="#ffb4ab"
                      strokeDasharray="5 5"
                      strokeWidth={1.5}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#a4e6ff"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#a4e6ff', strokeWidth: 2, stroke: '#111318' }}
                    activeDot={{ r: 5, fill: '#a4e6ff', strokeWidth: 2, stroke: '#111318' }}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
