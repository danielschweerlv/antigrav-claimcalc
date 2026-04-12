import { useState, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { ChartCard } from './ChartCard';
import { fetchCaseTypeDistribution, CHART_COLORS } from '@/lib/analytics-helpers';
import { useEffect } from 'react';

// ─── Active shape render prop ──────────────────────────────────────────────
function ActiveShape(props) {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
    </g>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, percent } = payload[0].payload;
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-xl font-['Inter'] text-xs"
      style={{
        background: '#1e2024',
        borderColor: '#333539',
        color: '#e8f4f8',
      }}
    >
      <p className="font-semibold mb-0.5" style={{ color: '#a4e6ff' }}>{name}</p>
      <p>
        <span style={{ color: '#bbc9cf' }}>Count: </span>
        <span style={{ color: '#e8f4f8' }}>{value}</span>
      </p>
      <p>
        <span style={{ color: '#bbc9cf' }}>Share: </span>
        <span style={{ color: '#4ADE80' }}>{(percent * 100).toFixed(1)}%</span>
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function CaseTypeBreakdown() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await fetchCaseTypeDistribution();
        if (!cancelled) {
          setData(result ?? []);
        }
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  const handleMouseEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <ChartCard title="Cases by Type">
        <div className="flex items-center justify-center h-56">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#333539', borderTopColor: '#a4e6ff' }}
          />
        </div>
      </ChartCard>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (!data.length) {
    return (
      <ChartCard title="Cases by Type">
        <div
          className="flex flex-col items-center justify-center h-56 gap-2 font-['Manrope'] text-sm"
          style={{ color: '#bbc9cf' }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="#333539" strokeWidth="2" />
            <circle cx="20" cy="20" r="8" stroke="#333539" strokeWidth="2" />
          </svg>
          <span>No case type data yet</span>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Cases by Type">
      <div className="flex flex-row items-center gap-6 w-full">
        {/* ── Donut chart ── */}
        <div className="relative flex-shrink-0" style={{ width: 220, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                animationDuration={1000}
                animationBegin={300}
                activeIndex={activeIndex ?? undefined}
                activeShape={ActiveShape}
                onMouseLeave={handleMouseLeave}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.4
                    }
                    onMouseEnter={(_, i) => handleMouseEnter(_, index)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* ── Donut center label ── */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <AnimatePresence mode="wait">
              {activeItem ? (
                <motion.div
                  key={`active-${activeIndex}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col items-center gap-0.5 px-2 text-center"
                >
                  <span
                    className="font-['Space_Grotesk'] font-bold text-xl leading-tight"
                    style={{ color: CHART_COLORS[activeIndex % CHART_COLORS.length] }}
                  >
                    {activeItem.value}
                  </span>
                  <span
                    className="font-['Inter'] text-[10px] leading-tight max-w-[80px] text-center"
                    style={{ color: '#bbc9cf' }}
                  >
                    {activeItem.name}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span
                    className="font-['Space_Grotesk'] font-bold text-2xl leading-none"
                    style={{ color: '#a4e6ff' }}
                  >
                    <AnimatedCounter value={total} duration={1200} />
                  </span>
                  <span
                    className="font-['Inter'] text-[11px] uppercase tracking-widest"
                    style={{ color: '#bbc9cf' }}
                  >
                    Total
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.map((entry, index) => {
            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0';
            const color = CHART_COLORS[index % CHART_COLORS.length];
            const isActive = activeIndex === index;
            const isDimmed = activeIndex !== null && !isActive;

            return (
              <motion.div
                key={entry.name}
                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors"
                style={{
                  background: isActive ? 'rgba(164,230,255,0.06)' : 'transparent',
                  opacity: isDimmed ? 0.45 : 1,
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                transition={{ duration: 0.15 }}
              >
                {/* Color dot */}
                <div
                  className="flex-shrink-0 rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    background: color,
                    boxShadow: isActive ? `0 0 6px ${color}88` : 'none',
                  }}
                />

                {/* Name */}
                <span
                  className="font-['Manrope'] text-xs flex-1 truncate leading-tight"
                  style={{ color: isActive ? '#e8f4f8' : '#bbc9cf' }}
                >
                  {entry.name}
                </span>

                {/* Count + pct */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="font-['Space_Grotesk'] font-semibold text-xs tabular-nums"
                    style={{ color: isActive ? color : '#e8f4f8' }}
                  >
                    {entry.value}
                  </span>
                  <span
                    className="font-['Inter'] text-[10px] tabular-nums w-10 text-right"
                    style={{ color: '#6b7b82' }}
                  >
                    {pct}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
}
