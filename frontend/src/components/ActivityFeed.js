import { FiZap, FiTrendingUp, FiTarget, FiAward, FiCalendar } from 'react-icons/fi';

export default function ActivityFeed({ stats, recommendations }) {
  if (!stats) return null;

  const activities = [];
  const now = new Date();

  if (stats.stats && stats.stats.leetcode) {
    const lc = stats.stats.leetcode;
    activities.push({
      icon: <FiTrendingUp size={14} />,
      color: '#ffa116',
      text: `Solved ${lc.solvedCount} problems on LeetCode`,
      sub: `${lc.easy} Easy · ${lc.medium} Medium · ${lc.hard} Hard`,
      time: 'All time'
    });
  }

  if (stats.stats && stats.stats.codeforces) {
    const cf = stats.stats.codeforces;
    activities.push({
      icon: <FiAward size={14} />,
      color: '#3b82f6',
      text: `Codeforces rating: ${cf.rating}`,
      sub: `Rank: ${cf.rank} · Solved: ${cf.solvedCount}`,
      time: 'Current'
    });
  }

  if (stats.streak > 0) {
    activities.push({
      icon: <FiZap size={14} />,
      color: '#f59e0b',
      text: `${stats.streak} day streak active 🔥`,
      sub: `Best streak: ${stats.maxStreak} days`,
      time: 'Today'
    });
  }

  if (recommendations && recommendations.problems) {
    const solved = recommendations.problems.filter(p => p.solved).length;
    activities.push({
      icon: <FiTarget size={14} />,
      color: '#3fb950',
      text: `${solved}/${recommendations.problems.length} problems solved today`,
      sub: `Weak areas: ${recommendations.weakTopics ? recommendations.weakTopics.slice(0,2).join(', ') : 'N/A'}`,
      time: 'Today'
    });
  }

  activities.push({
    icon: <FiCalendar size={14} />,
    color: '#58a6ff',
    text: `Total ${stats.totalSolved} problems solved`,
    sub: 'Across all platforms',
    time: 'All time'
  });

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Activity Summary</h2>
          <p style={s.sub}>Your progress at a glance</p>
        </div>
      </div>
      <div style={s.list}>
        {activities.map((a, i) => (
          <div key={i} style={s.item}>
            <div style={{ ...s.iconWrap, background: a.color + '18', color: a.color }}>
              {a.icon}
            </div>
            <div style={s.itemInfo}>
              <div style={s.itemText}>{a.text}</div>
              <div style={s.itemSub}>{a.sub}</div>
            </div>
            <div style={s.itemTime}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  section: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  header: { marginBottom: '1.25rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sub: { fontSize: '0.75rem', color: '#484f58' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: { display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: '#0d1117', borderRadius: '8px', border: '1px solid #21262d' },
  iconWrap: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemText: { fontSize: '0.825rem', color: '#c9d1d9', fontWeight: '500' },
  itemSub: { fontSize: '0.75rem', color: '#484f58', marginTop: '0.15rem' },
  itemTime: { fontSize: '0.7rem', color: '#484f58', flexShrink: 0 },
};