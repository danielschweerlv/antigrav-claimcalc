import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnimatedCounter } from './AnimatedCounter';
import { ChartCard } from './ChartCard';

// ─── Mock Data ─────────────────────────────────────────────────────────────
const IS_MOCK = true;

const MOCK_STATS = [
  { label: 'Sessions',   value: 1234, key: 'sessions' },
  { label: 'Users',      value: 892,  key: 'users' },
  { label: 'Page Views', value: 3456, key: 'pageviews' },
];

const MOCK_TREND = [
  { day: 'Mon', sessions: 142 },
  { day: 'Tue', sessions: 198 },
  { day: 'Wed', sessions: 175 },
  { day: 'Thu', sessions: 231 },
  { day: 'Fri', sessions: 189 },
  { day: 'Sat', sessions: 156 },
  { day: 'Sun', sessions: 143 },
];

// ─── BarChart3 icon (Lucide-style, inline SVG) ─────────────────────────────
function BarChart3Icon({ size = 14, color = '#6b7b82' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div
      className="flex-1 rounded-xl px-4 py-3 flex flex-col gap-1 min-w-0"
      style={{ background: '#16191e', border: '1px solid #333539' }}
    >
      <span
        className="font-['Inter'] text-[10px] uppercase tracking-widest"
        style={{ color: '#6b7b82' }}
      >
        {label}
      </span>
      <span
        className="font-['Space_Grotesk'] font-bold text-2xl leading-none tabular-nums"
        style={{ color: '#a4e6ff' }}
      >
        <AnimatedCounter value={value} duration={1400} />
      </span>
    </div>
  );
}

// ─── Custom sparkline tooltip ──────────────────────────────────────────────
function SparkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-2.5 py-1.5 shadow-xl font-['Inter'] text-xs"
      style={{ background: '#1e2024', borderColor: '#333539', color: '#e8f4f8' }}
    >
      <p style={{ color: '#bbc9cf' }} className="mb-0.5">{label}</p>
      <p>
        <span style={{ color: '#a4e6ff' }} className="font-semibold">
          {payload[0].value}
        </span>
        <span style={{ color: '#6b7b82' }}> sessions</span>
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function TrafficOverview() {
  return (
    <ChartCard title="Site Traffic">
      <div className="flex flex-col gap-4 w-full">

        {/* ── Mock data banner ── */}
        {IS_MOCK && (
          <div
            className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 font-['Manrope'] text-xs"
            style={{
              background: 'rgba(164, 230, 255, 0.06)',
              border: '1px solid rgba(164, 230, 255, 0.18)',
              color: '#bbc9cf',
            }}
          >
            {/* Info icon */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a4e6ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              Connect GA4 tracking to see live data.{' '}
              <span style={{ color: '#a4e6ff' }}>
                Showing sample data.
              </span>
            </span>
          </div>
        )}

        {/* ── Stat cards row ── */}
        <div className="flex flex-row gap-3">
          {MOCK_STATS.map((stat) => (
            <StatCard key={stat.key} label={stat.label} value={stat.value} />
          ))}
        </div>

        {/* ── Sparkline area chart ── */}
        <div style={{ height: 150, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_TREND}
              margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a4e6ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a4e6ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Intentionally no axis labels for clean sparkline look */}
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip
                content={<SparkTooltip />}
                cursor={{ stroke: '#333539', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#a4e6ff"
                strokeWidth={2}
                fill="url(#trafficGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#a4e6ff',
                  stroke: '#111318',
                  strokeWidth: 2,
                }}
                animationDuration={1200}
                animationBegin={200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Footer attribution ── */}
        <div
          className="flex items-center gap-1.5 font-['Inter'] text-[11px]"
          style={{ color: '#bbc9cf' }}
        >
          <BarChart3Icon size={13} color="#6b7b82" />
          <span>Data from Google Analytics</span>
        </div>

      </div>
    </ChartCard>
  );
}
