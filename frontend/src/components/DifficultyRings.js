import { useEffect, useRef } from 'react';

function Ring({ percentage, color, size = 80, strokeWidth = 6, label, value }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={s.ringWrap}>
      <svg width={size} height={size} style={s.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#21262d"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize="14"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {value}
        </text>
      </svg>
      <div style={s.ringLabel}>{label}</div>
      <div style={{ ...s.ringPct, color }}>{Math.round(percentage)}%</div>
    </div>
  );
}

export default function DifficultyRings({ leetcode }) {
  if (!leetcode) return null;

  const total = leetcode.solvedCount || 1;
  const easy = leetcode.easy || 0;
  const medium = leetcode.medium || 0;
  const hard = leetcode.hard || 0;

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Difficulty Breakdown</h2>
          <p style={s.sub}>LeetCode problems by difficulty</p>
        </div>
        <div style={s.total}>
          <span style={s.totalNum}>{total}</span>
          <span style={s.totalLabel}>total</span>
        </div>
      </div>
      <div style={s.rings}>
        <Ring
          percentage={(easy / total) * 100}
          color="#3fb950"
          label="Easy"
          value={easy}
        />
        <Ring
          percentage={(medium / total) * 100}
          color="#d29922"
          label="Medium"
          value={medium}
        />
        <Ring
          percentage={(hard / total) * 100}
          color="#f85149"
          label="Hard"
          value={hard}
        />
      </div>
      <div style={s.bars}>
        {[
          { label: 'Easy', value: easy, total: 800, color: '#3fb950' },
          { label: 'Medium', value: medium, total: 1700, color: '#d29922' },
          { label: 'Hard', value: hard, total: 700, color: '#f85149' },
        ].map(item => (
          <div key={item.label} style={s.barRow}>
            <span style={s.barLabel}>{item.label}</span>
            <div style={s.barTrack}>
              <div style={{
                ...s.barFill,
                width: `${Math.min((item.value / item.total) * 100, 100)}%`,
                background: item.color
              }} />
            </div>
            <span style={{ ...s.barValue, color: item.color }}>{item.value}/{item.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  section: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sub: { fontSize: '0.75rem', color: '#484f58' },
  total: { textAlign: 'right' },
  totalNum: { fontSize: '1.5rem', fontWeight: '700', color: '#58a6ff', display: 'block' },
  totalLabel: { fontSize: '0.7rem', color: '#484f58' },
  rings: { display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem' },
  ringWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' },
  svg: { display: 'block' },
  ringLabel: { fontSize: '0.75rem', color: '#8b949e', fontWeight: '500' },
  ringPct: { fontSize: '0.7rem', fontWeight: '600' },
  bars: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  barRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  barLabel: { fontSize: '0.75rem', color: '#8b949e', width: '48px', flexShrink: 0 },
  barTrack: { flex: 1, background: '#21262d', borderRadius: '4px', height: '6px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 1s ease' },
  barValue: { fontSize: '0.7rem', fontWeight: '500', width: '70px', textAlign: 'right', flexShrink: 0 },
};