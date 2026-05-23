import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiZap, FiGrid, FiUser, FiLogOut, FiExternalLink,
  FiTrendingUp, FiTarget, FiAward, FiCode
} from 'react-icons/fi';
import { SiLeetcode, SiCodeforces } from 'react-icons/si';

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
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDifficultyColor = (d) => d === 'easy' ? '#3fb950' : d === 'medium' ? '#d29922' : '#f85149';
  const getPlatformColor = (p) => ({ leetcode: '#ffa116', codeforces: '#3b82f6', codechef: '#8b5cf6', geeksforgeeks: '#3fb950', hackerrank: '#00ea64', hackerearth: '#2c99e8' }[p] || '#58a6ff');

  return (
    <div style={s.layout}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarTop}>
          <Link to="/" style={s.logo}>
            <FiZap size={18} color="#58a6ff" />
            <span style={s.logoText}>CP Tracker</span>
          </Link>
          <nav style={s.nav}>
            <div style={s.navItem}>
              <FiGrid size={16} />
              <span>Dashboard</span>
            </div>
            <Link to="/profile" style={s.navItemLink}>
              <FiUser size={16} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
        <div style={s.sidebarBottom}>
          <div style={s.userInfo}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.userEmail}>{user?.email?.split('@')[0]}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.headerTitle}>Dashboard</h1>
            <p style={s.headerSub}>Track your competitive programming progress</p>
          </div>
          <div style={s.headerDate}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={s.statsGrid}>
          {[
            { label: 'Total Solved', value: loadingStats ? '...' : (stats?.totalSolved || 0), sub: 'across all platforms', icon: <FiAward size={18} />, color: '#58a6ff' },
            { label: 'LeetCode', value: loadingStats ? '...' : (stats?.stats?.leetcode?.solvedCount || 0), sub: stats?.stats?.leetcode ? `${stats.stats.leetcode.easy}E · ${stats.stats.leetcode.medium}M · ${stats.stats.leetcode.hard}H` : 'Not connected', icon: <SiLeetcode size={18} />, color: '#ffa116' },
            { label: 'Codeforces', value: loadingStats ? '...' : (stats?.stats?.codeforces?.rating || 'N/A'), sub: stats?.stats?.codeforces?.rank || 'Not connected', icon: <SiCodeforces size={18} />, color: '#3b82f6' },
            { label: 'HackerRank', value: loadingStats ? '...' : (stats?.stats?.hackerrank?.solvedCount || 0), sub: stats?.stats?.hackerrank ? `${stats.stats.hackerrank.badges?.length || 0} badges` : 'Not connected', icon: <FiCode size={18} />, color: '#00ea64' },
          ].map((card, i) => (
            <div key={i} style={s.statCard}>
              <div style={s.statCardHeader}>
                <span style={s.statLabel}>{card.label}</span>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
              <div style={{ ...s.statValue, color: card.color }}>{card.value}</div>
              <div style={s.statSub}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div style={s.mainGrid}>
          {/* Today's Problems */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div>
                <h2 style={s.sectionTitle}>Today's Problems</h2>
                <p style={s.sectionSub}>Based on your weak areas</p>
              </div>
              {recommendations && (
                <div style={s.weakTopics}>
                  {recommendations.weakTopics?.slice(0, 3).map(t => (
                    <span key={t} style={s.topicTag}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            {loadingRecs ? (
              <div style={s.skeleton}>
                {[1,2,3,4,5].map(i => <div key={i} style={s.skeletonRow} />)}
              </div>
            ) : !recommendations ? (
              <div style={s.empty}>
                <FiTarget size={32} color="#30363d" />
                <p>Add your platform handles in <Link to="/profile" style={{color:'#58a6ff'}}>Profile</Link> to get recommendations</p>
              </div>
            ) : (
              <div style={s.problemList}>
                {recommendations.problems?.map((item, i) => (
                  <div key={i} style={s.problemRow}>
                    <span style={s.problemNum}>{i + 1}</span>
                    <span style={{
                      ...s.platformTag,
                      background: getPlatformColor(item.problem?.platform) + '18',
                      color: getPlatformColor(item.problem?.platform),
                      border: `1px solid ${getPlatformColor(item.problem?.platform)}33`
                    }}>
                      {item.problem?.platform?.slice(0,2).toUpperCase()}
                    </span>
                    <span style={s.problemTitle}>{item.problem?.title}</span>
                    {item.problem?.cf_rating && <span style={s.cfRating}>{item.problem.cf_rating}</span>}
                    <span style={{ ...s.diffBadge, color: getDifficultyColor(item.problem?.difficulty) }}>
                      {item.problem?.difficulty}
                    </span>
                    {item.solved ? (
                      <span style={s.solvedBadge}>✓ Solved</span>
                    ) : (
                      <a href={item.problem ? item.problem.url : '#'} target="_blank" rel="noreferrer" style={s.solveBtn}>
                        Solve <FiExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Topic Breakdown */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div>
                <h2 style={s.sectionTitle}>Topic Breakdown</h2>
                <p style={s.sectionSub}>Your strongest areas</p>
              </div>
              <FiTrendingUp size={18} color="#58a6ff" />
            </div>
            {loadingStats ? (
              <div style={s.skeleton}>
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} style={s.skeletonRow} />)}
              </div>
            ) : stats?.stats?.leetcode?.topicCount ? (
              <div style={s.topicList}>
                {Object.entries(stats.stats.leetcode.topicCount)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([topic, count]) => (
                    <div key={topic} style={s.topicRow}>
                      <span style={s.topicName}>{topic}</span>
                      <div style={s.barWrap}>
                        <div style={{ ...s.bar, width: `${Math.min((count / 75) * 100, 100)}%` }} />
                      </div>
                      <span style={s.topicCount}>{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={s.empty}>
                <p>Connect LeetCode in <Link to="/profile" style={{color:'#58a6ff'}}>Profile</Link></p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0d1117' },

  // Sidebar
  sidebar: { width: '220px', background: '#161b22', borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'fixed', height: '100vh', padding: '1.25rem 0' },
  sidebarTop: { padding: '0 1rem' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.25rem 0' },
  logoText: { fontSize: '1rem', fontWeight: '700', color: '#e6edf3' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '6px', color: '#e6edf3', fontSize: '0.875rem', fontWeight: '500', background: '#21262d', cursor: 'pointer' },
  navItemLink: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '6px', color: '#8b949e', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' },
  sidebarBottom: { padding: '0 1rem', borderTop: '1px solid #21262d', paddingTop: '1rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'white', flexShrink: 0 },
  userName: { fontSize: '0.8rem', fontWeight: '600', color: '#e6edf3' },
  userEmail: { fontSize: '0.75rem', color: '#484f58' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem 0' },

  // Main
  main: { marginLeft: '220px', flex: 1, padding: '2rem', maxWidth: 'calc(100vw - 220px)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  headerTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.25rem' },
  headerSub: { color: '#8b949e', fontSize: '0.875rem' },
  headerDate: { color: '#484f58', fontSize: '0.8rem' },

  // Stats
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.25rem' },
  statCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  statLabel: { fontSize: '0.75rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' },
  statValue: { fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.25rem' },
  statSub: { fontSize: '0.75rem', color: '#484f58' },

  // Sections
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  section: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' },
  sectionTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sectionSub: { fontSize: '0.75rem', color: '#484f58' },
  weakTopics: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' },
  topicTag: { fontSize: '0.7rem', background: '#1f6feb18', color: '#58a6ff', padding: '0.2rem 0.5rem', borderRadius: '20px', border: '1px solid #1f6feb33' },

  // Problems
  problemList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  problemRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d' },
  problemNum: { fontSize: '0.75rem', color: '#484f58', width: '16px', flexShrink: 0 },
  platformTag: { fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.4rem', borderRadius: '3px', flexShrink: 0 },
  problemTitle: { fontSize: '0.825rem', color: '#c9d1d9', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cfRating: { fontSize: '0.7rem', color: '#484f58', flexShrink: 0 },
  diffBadge: { fontSize: '0.75rem', fontWeight: '500', textTransform: 'capitalize', flexShrink: 0 },
  solvedBadge: { fontSize: '0.7rem', background: '#3fb95018', color: '#3fb950', padding: '0.2rem 0.5rem', borderRadius: '4px', flexShrink: 0 },
  solveBtn: { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', background: '#1f6feb', color: 'white', padding: '0.25rem 0.625rem', borderRadius: '4px', fontWeight: '500', flexShrink: 0 },

  // Topics
  topicList: { display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  topicRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  topicName: { fontSize: '0.775rem', color: '#8b949e', width: '140px', flexShrink: 0 },
  barWrap: { flex: 1, background: '#21262d', borderRadius: '4px', height: '5px', overflow: 'hidden' },
  bar: { height: '100%', background: 'linear-gradient(90deg, #1f6feb, #58a6ff)', borderRadius: '4px' },
  topicCount: { fontSize: '0.75rem', color: '#484f58', width: '24px', textAlign: 'right' },

  // States
  skeleton: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  skeletonRow: { height: '44px', background: '#21262d', borderRadius: '6px', animation: 'pulse 1.5s infinite' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem 0', color: '#484f58', fontSize: '0.875rem', textAlign: 'center' },
};