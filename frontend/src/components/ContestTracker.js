import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiExternalLink, FiCalendar } from 'react-icons/fi';

export default function ContestTracker() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const cfRes = await axios.get('https://codeforces.com/api/contest.list');
      const cfContests = cfRes.data.result
        .filter(c => c.phase === 'BEFORE')
        .slice(0, 4)
        .map(c => ({
          id: `cf-${c.id}`,
          name: c.name,
          platform: 'Codeforces',
          platformShort: 'CF',
          platformColor: '#3b82f6',
          startTime: new Date(c.startTimeSeconds * 1000),
          duration: Math.round(c.durationSeconds / 3600),
          url: `https://codeforces.com/contest/${c.id}`
        }));

      // LeetCode weekly/biweekly contests (static upcoming ones since LC doesn't have public API)
      const now = new Date();
      const lcContests = [];

      // Next weekly contest (every Sunday 8 AM IST = 2:30 AM UTC)
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      nextSunday.setUTCHours(2, 30, 0, 0);
      if (nextSunday > now) {
        lcContests.push({
          id: 'lc-weekly',
          name: `LeetCode Weekly Contest`,
          platform: 'LeetCode',
          platformShort: 'LC',
          platformColor: '#ffa116',
          startTime: nextSunday,
          duration: 1.5,
          url: 'https://leetcode.com/contest/'
        });
      }

      // Next biweekly contest (every other Saturday 8 PM IST = 2:30 PM UTC)
      const nextSaturday = new Date(now);
      nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
      nextSaturday.setUTCHours(14, 30, 0, 0);
      if (nextSaturday > now) {
        lcContests.push({
          id: 'lc-biweekly',
          name: `LeetCode Biweekly Contest`,
          platform: 'LeetCode',
          platformShort: 'LC',
          platformColor: '#ffa116',
          startTime: nextSaturday,
          duration: 1.5,
          url: 'https://leetcode.com/contest/'
        });
      }

      const all = [...cfContests, ...lcContests]
        .sort((a, b) => a.startTime - b.startTime);

      setContests(all);
    } catch (err) {
      console.error('Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }) + ' IST';
  };

  const getTimeUntil = (date) => {
    const diff = date - new Date();
    if (diff < 0) return 'Started';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${mins}m`;
    return `in ${mins}m`;
  };

  const filtered = activeTab === 'all' ? contests :
    contests.filter(c => c.platform.toLowerCase() === activeTab);

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Upcoming Contests</h2>
          <p style={s.sub}>Never miss a contest — times shown in IST</p>
        </div>
        <FiCalendar size={18} color="#58a6ff" />
      </div>

      <div style={s.tabs}>
        {['all', 'codeforces', 'leetcode'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...s.tab,
              background: activeTab === tab ? '#1f6feb' : 'transparent',
              color: activeTab === tab ? 'white' : '#8b949e',
              border: activeTab === tab ? '1px solid #1f6feb' : '1px solid #21262d'
            }}
          >
            {tab === 'all' ? 'All' : tab === 'codeforces' ? 'Codeforces' : 'LeetCode'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.skeleton}>
          {[1,2,3].map(i => <div key={i} style={s.skeletonRow} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>No upcoming contests found</div>
      ) : (
        <div style={s.list}>
          {filtered.map(c => (
            <div key={c.id} style={s.contestRow}>
              <div style={s.contestLeft}>
                <span style={{
                  ...s.platform,
                  background: c.platformColor + '18',
                  color: c.platformColor,
                  border: `1px solid ${c.platformColor}33`
                }}>
                  {c.platformShort}
                </span>
                <div>
                  <div style={s.contestName}>{c.name}</div>
                  <div style={s.contestMeta}>
                    {formatDate(c.startTime)} · {c.duration}h
                  </div>
                </div>
              </div>
              <div style={s.contestRight}>
                <span style={s.timeUntil}>{getTimeUntil(c.startTime)}</span>
                <a href={c.url} target="_blank" rel="noreferrer" style={{
                  ...s.registerBtn,
                  background: c.platformColor
                }}>
                  Register <FiExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  section: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sub: { fontSize: '0.75rem', color: '#484f58' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  tab: { fontSize: '0.75rem', fontWeight: '500', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  contestRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d' },
  contestLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 },
  platform: { fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.4rem', borderRadius: '3px', flexShrink: 0 },
  contestName: { fontSize: '0.825rem', color: '#c9d1d9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '260px' },
  contestMeta: { fontSize: '0.7rem', color: '#484f58', marginTop: '0.2rem' },
  contestRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },
  timeUntil: { fontSize: '0.75rem', color: '#d29922', fontWeight: '500' },
  registerBtn: { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'white', padding: '0.25rem 0.625rem', borderRadius: '4px', fontWeight: '500' },
  skeleton: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  skeletonRow: { height: '60px', borderRadius: '6px', background: 'linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.5s infinite' },
  empty: { color: '#484f58', fontSize: '0.875rem', padding: '1rem 0', textAlign: 'center' },
};