import { FiTrendingUp, FiZap, FiTarget, FiCalendar } from 'react-icons/fi';

export default function WeeklyProgress({ stats, recommendations }) {
  if (!stats) return null;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const daysActive = stats.streak ? Math.min(stats.streak, 7) : 0;
  const weeklyTarget = 35;
  const weeklyProgress = Math.min((daysActive / 7) * 100, 100);

  const todaySolved = recommendations
    ? recommendations.problems.filter(p => p.solved).length
    : 0;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today_idx = today.getDay();

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Weekly Progress</h2>
          <p style={s.sub}>
            {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
            {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <FiCalendar size={18} color="#58a6ff" />
      </div>

      {/* Day activity dots */}
      <div style={s.daysRow}>
        {days.map((day, i) => {
          const isPast = i < today_idx;
          const isToday = i === today_idx;
          const isActive = isPast
            ? i >= today_idx - daysActive + 1
            : isToday && stats.lastActiveDate === new Date().toISOString().split('T')[0];

          return (
            <div key={day} style={s.dayWrap}>
              <div style={{
                ...s.dayDot,
                background: isToday
                  ? '#1f6feb'
                  : isActive
                  ? '#3fb950'
                  : i > today_idx
                  ? '#161b22'
                  : '#21262d',
                border: isToday ? '2px solid #58a6ff' : '2px solid transparent',
                opacity: i > today_idx ? 0.4 : 1
              }} />
              <span style={{ ...s.dayLabel, color: isToday ? '#58a6ff' : '#484f58' }}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Weekly streak bar */}
      <div style={s.progressWrap}>
        <div style={s.progressHeader}>
          <span style={s.progressLabel}>Weekly activity</span>
          <span style={s.progressValue}>{daysActive}/7 days</span>
        </div>
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${weeklyProgress}%` }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={s.statsRow}>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#3fb95018', color: '#3fb950' }}>
            <FiTarget size={14} />
          </div>
          <div style={s.statNum}>{todaySolved}</div>
          <div style={s.statLabel}>Solved today</div>
        </div>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#f59e0b18', color: '#f59e0b' }}>
            <FiZap size={14} />
          </div>
          <div style={s.statNum}>{stats.streak || 0}🔥</div>
          <div style={s.statLabel}>Current streak</div>
        </div>
        <div style={s.statBox}>
          <div style={{ ...s.statIcon, background: '#58a6ff18', color: '#58a6ff' }}>
            <FiTrendingUp size={14} />
          </div>
          <div style={s.statNum}>{stats.maxStreak || 0}</div>
          <div style={s.statLabel}>Best streak</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  section: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sub: { fontSize: '0.75rem', color: '#484f58' },
  daysRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' },
  dayWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' },
  dayDot: { width: '28px', height: '28px', borderRadius: '50%', transition: 'all 0.3s ease' },
  dayLabel: { fontSize: '0.65rem', fontWeight: '500' },
  progressWrap: { marginBottom: '1.25rem' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  progressLabel: { fontSize: '0.75rem', color: '#8b949e' },
  progressValue: { fontSize: '0.75rem', color: '#3fb950', fontWeight: '600' },
  progressTrack: { background: '#21262d', borderRadius: '4px', height: '6px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #3fb950, #58a6ff)', borderRadius: '4px', transition: 'width 1s ease' },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' },
  statBox: { background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' },
  statIcon: { width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' },
  statNum: { fontSize: '1.1rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.2rem' },
  statLabel: { fontSize: '0.65rem', color: '#484f58' },
};