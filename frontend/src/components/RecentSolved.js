import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiExternalLink, FiCheckCircle } from 'react-icons/fi';

export default function RecentSolved({ cfHandle }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cfHandle) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=10`
        );
        const accepted = res.data.result
          .filter(s => s.verdict === 'OK')
          .reduce((acc, s) => {
            const key = `${s.problem.contestId}-${s.problem.index}`;
            if (!acc.find(p => p.key === key)) {
              acc.push({
                key,
                name: s.problem.name,
                rating: s.problem.rating,
                tags: s.problem.tags,
                url: `https://codeforces.com/contest/${s.problem.contestId}/problem/${s.problem.index}`,
                time: new Date(s.creationTimeSeconds * 1000)
              });
            }
            return acc;
          }, [])
          .slice(0, 8);
        setProblems(accepted);
      } catch (err) {
        console.error('Failed to fetch CF submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cfHandle]);

  const timeAgo = (date) => {
    const diff = Date.now() - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (!cfHandle) return null;

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Recent CF Solves</h2>
          <p style={s.sub}>Last 10 accepted submissions</p>
        </div>
        <FiCheckCircle size={18} color="#3b82f6" />
      </div>

      {loading ? (
        <div style={s.skeleton}>
          {[1,2,3,4,5].map(i => <div key={i} style={s.skeletonRow} />)}
        </div>
      ) : problems.length === 0 ? (
        <div style={s.empty}>No recent solved problems found</div>
      ) : (
        <div style={s.list}>
          {problems.map(p => (
            <div key={p.key} style={s.row}>
              <div style={s.checkIcon}>✓</div>
              <div style={s.info}>
                <div style={s.name}>{p.name}</div>
                <div style={s.tags}>
                  {p.tags.slice(0,2).map(tag => (
                    <span key={tag} style={s.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={s.right}>
                {p.rating && <span style={s.rating}>{p.rating}</span>}
                <span style={s.time}>{timeAgo(p.time)}</span>
                <a href={p.url} target="_blank" rel="noreferrer" style={s.link}>
                  <FiExternalLink size={12} />
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sub: { fontSize: '0.75rem', color: '#484f58' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  row: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d' },
  checkIcon: { color: '#3fb950', fontSize: '0.875rem', flexShrink: 0, width: '20px', textAlign: 'center' },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: '0.825rem', color: '#c9d1d9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tags: { display: 'flex', gap: '0.25rem', marginTop: '0.2rem' },
  tag: { fontSize: '0.6rem', background: '#21262d', color: '#484f58', padding: '0.1rem 0.35rem', borderRadius: '3px' },
  right: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 },
  rating: { fontSize: '0.7rem', color: '#3b82f6', fontWeight: '600' },
  time: { fontSize: '0.7rem', color: '#484f58' },
  link: { color: '#484f58' },
  skeleton: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  skeletonRow: { height: '52px', borderRadius: '6px', background: 'linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.5s infinite' },
  empty: { color: '#484f58', fontSize: '0.875rem', padding: '1.5rem 0', textAlign: 'center' },
};
