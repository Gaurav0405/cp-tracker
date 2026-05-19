import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecommendations();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/user/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecommendations = async () => {
  try {
    const res = await api.get('/recommendations/today', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    setRecommendations(res.data);
  } catch (err) {
    // No handles set yet
  } finally {
    setLoadingRecs(false);
  }
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'easy') return '#22c55e';
    if (difficulty === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      leetcode: '#f89f1b',
      codeforces: '#3b82f6',
      codechef: '#8b5cf6',
      geeksforgeeks: '#22c55e',
      hackerrank: '#00ea64',
      hackerearth: '#2c99e8'
    };
    return colors[platform] || '#6366f1';
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>⚡ CP Tracker</div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 {user && user.name}</span>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Solved</div>
            <div style={styles.statValue}>
              {loadingStats ? '...' : (stats && stats.totalSolved ? stats.totalSolved : 0)}
            </div>
            <div style={styles.statSub}>across all platforms</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>LeetCode</div>
            <div style={{...styles.statValue, color: '#f89f1b'}}>
              {loadingStats ? '...' : (stats && stats.stats && stats.stats.leetcode ? stats.stats.leetcode.solvedCount : 0)}
            </div>
            <div style={styles.statSub}>
              {stats && stats.stats && stats.stats.leetcode ?
                `${stats.stats.leetcode.easy}E · ${stats.stats.leetcode.medium}M · ${stats.stats.leetcode.hard}H`
                : 'Not connected'}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Codeforces</div>
            <div style={{...styles.statValue, color: '#3b82f6'}}>
              {loadingStats ? '...' : (stats && stats.stats && stats.stats.codeforces ? stats.stats.codeforces.rating : 'N/A')}
            </div>
            <div style={styles.statSub}>
              {stats && stats.stats && stats.stats.codeforces ? stats.stats.codeforces.rank : 'Not connected'}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>HackerRank</div>
            <div style={{...styles.statValue, color: '#00ea64'}}>
              {loadingStats ? '...' : (stats && stats.stats && stats.stats.hackerrank ? stats.stats.hackerrank.solvedCount : 0)}
            </div>
            <div style={styles.statSub}>
              {stats && stats.stats && stats.stats.hackerrank ?
                `${stats.stats.hackerrank.badges ? stats.stats.hackerrank.badges.length : 0} badges`
                : 'Not connected'}
            </div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>🎯 Today's Problems</h2>
              <span style={styles.sectionSub}>Based on your weak areas</span>
            </div>

            {loadingRecs ? (
              <div style={styles.loading}>Loading recommendations...</div>
            ) : !recommendations ? (
              <div style={styles.emptyState}>
                <p>Add your platform handles in <Link to="/profile" style={{color:'#6366f1'}}>Profile</Link> to get recommendations</p>
              </div>
            ) : (
              <div>
                <div style={styles.weakTopics}>
                  {recommendations.weakTopics && recommendations.weakTopics.map(topic => (
                    <span key={topic} style={styles.topicTag}>{topic}</span>
                  ))}
                </div>
                <div style={styles.problemList}>
                  {recommendations.problems && recommendations.problems.map((item, i) => (
                    <div key={i} style={styles.problemCard}>
                      <div style={styles.problemInfo}>
                        <span style={{
                          ...styles.platformBadge,
                          background: getPlatformColor(item.problem ? item.problem.platform : '') + '22',
                          color: getPlatformColor(item.problem ? item.problem.platform : '')
                        }}>
                          {item.problem ? item.problem.platform : ''}
                        </span>
                        <span style={styles.problemTitle}>
                          {item.problem ? item.problem.title : ''}
                        </span>
                        {item.problem && item.problem.cf_rating && (
                          <span style={styles.ratingBadge}>
                            {item.problem.cf_rating}
                          </span>
                        )}
                      </div>
                      <div style={styles.problemRight}>
                        <span style={{
                          ...styles.diffBadge,
                          color: getDifficultyColor(item.problem ? item.problem.difficulty : '')
                        }}>
                          {item.problem ? item.problem.difficulty : ''}
                        </span>
                        {item.solved ? (
                          <span style={styles.solvedBadge}>✓ Solved</span>
                        ) : (
                          <a  
                            href={item.problem ? item.problem.url : '#'}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.solveBtn}
                          >
                            Solve ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>📊 Topic Breakdown</h2>
              <span style={styles.sectionSub}>Your strongest areas</span>
            </div>
            {loadingStats ? (
              <div style={styles.loading}>Loading...</div>
            ) : stats && stats.stats && stats.stats.leetcode && stats.stats.leetcode.topicCount ? (
              <div style={styles.topicList}>
                {Object.entries(stats.stats.leetcode.topicCount)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([topic, count]) => (
                    <div key={topic} style={styles.topicRow}>
                      <span style={styles.topicName}>{topic}</span>
                      <div style={styles.topicBarContainer}>
                        <div style={{
                          ...styles.topicBar,
                          width: `${Math.min((count / 75) * 100, 100)}%`
                        }} />
                      </div>
                      <span style={styles.topicCount}>{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>Connect LeetCode in Profile to see topic breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1117' },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 2rem', background: '#1a1d2e',
    borderBottom: '1px solid #2d3148', position: 'sticky', top: 0, zIndex: 100
  },
  navLogo: { fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  navUser: { color: '#94a3b8', fontSize: '0.9rem' },
  navLink: { color: '#94a3b8', fontSize: '0.9rem' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #2d3148',
    color: '#94a3b8', borderRadius: '6px', padding: '0.4rem 0.875rem',
    cursor: 'pointer', fontSize: '0.875rem'
  },
  content: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem', marginBottom: '2rem'
  },
  statCard: {
    background: '#1a1d2e', border: '1px solid #2d3148',
    borderRadius: '12px', padding: '1.5rem'
  },
  statLabel: { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: '2rem', fontWeight: '700', color: '#6366f1', margin: '0.5rem 0' },
  statSub: { fontSize: '0.8rem', color: '#475569' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  section: {
    background: '#1a1d2e', border: '1px solid #2d3148',
    borderRadius: '12px', padding: '1.5rem'
  },
  sectionHeader: { marginBottom: '1.25rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: '600', color: '#f1f5f9' },
  sectionSub: { fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem', display: 'block' },
  loading: { color: '#475569', fontSize: '0.9rem', padding: '1rem 0' },
  emptyState: { color: '#475569', fontSize: '0.9rem', padding: '2rem 0', textAlign: 'center' },
  weakTopics: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' },
  topicTag: {
    background: '#6366f122', color: '#818cf8', fontSize: '0.75rem',
    padding: '0.25rem 0.625rem', borderRadius: '20px', border: '1px solid #6366f133'
  },
  problemList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  problemCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#0f1117', borderRadius: '8px', padding: '0.875rem 1rem',
    border: '1px solid #1e2235'
  },
  problemInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 },
  platformBadge: {
    fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.5rem',
    borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap'
  },
  problemTitle: {
    fontSize: '0.875rem', color: '#cbd5e1', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px'
  },
  ratingBadge: { fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' },
  problemRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },
  diffBadge: { fontSize: '0.75rem', fontWeight: '500', textTransform: 'capitalize' },
  solvedBadge: {
    background: '#22c55e22', color: '#22c55e', fontSize: '0.75rem',
    padding: '0.25rem 0.625rem', borderRadius: '4px'
  },
  solveBtn: {
    background: '#6366f1', color: 'white', fontSize: '0.75rem',
    padding: '0.3rem 0.75rem', borderRadius: '6px', fontWeight: '500'
  },
  topicList: { display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  topicRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  topicName: { fontSize: '0.8rem', color: '#94a3b8', width: '130px', flexShrink: 0 },
  topicBarContainer: {
    flex: 1, background: '#0f1117', borderRadius: '4px', height: '6px', overflow: 'hidden'
  },
  topicBar: { height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '4px' },
  topicCount: { fontSize: '0.8rem', color: '#475569', width: '25px', textAlign: 'right' }
};