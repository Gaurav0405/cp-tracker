import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiZap, FiCode, FiAward } from 'react-icons/fi';
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${baseURL}/user/public/${username}`);
      setProfile(res.data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { key: 'leetcode', label: 'LeetCode', color: '#ffa116', icon: <SiLeetcode size={16} />, url: 'https://leetcode.com/' },
    { key: 'codeforces', label: 'Codeforces', color: '#3b82f6', icon: <SiCodeforces size={16} />, url: 'https://codeforces.com/profile/' },
    { key: 'codechef', label: 'CodeChef', color: '#8b5cf6', icon: <SiCodechef size={16} />, url: 'https://www.codechef.com/users/' },
    { key: 'geeksforgeeks', label: 'GeeksForGeeks', color: '#3fb950', icon: <FiCode size={16} />, url: 'https://auth.geeksforgeeks.org/user/' },
    { key: 'hackerrank', label: 'HackerRank', color: '#00ea64', icon: <FiCode size={16} />, url: 'https://www.hackerrank.com/' },
    { key: 'hackerearth', label: 'HackerEarth', color: '#2c99e8', icon: <FiCode size={16} />, url: 'https://www.hackerearth.com/@' },
  ];

  if (loading) return (
    <div style={s.page}>
      <div style={s.loading}>Loading profile...</div>
    </div>
  );

  if (notFound) return (
    <div style={s.page}>
      <div style={s.notFound}>
        <h2 style={s.notFoundTitle}>User not found</h2>
        <p style={s.notFoundDesc}>No user found with username "{username}"</p>
        <Link to="/" style={s.homeBtn}>Go to CP Tracker</Link>
      </div>
    </div>
  );

  const connectedPlatforms = platforms.filter(p => profile.handles && profile.handles[p.key]);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.logo}>
          <FiZap size={18} color="#58a6ff" />
          <span style={s.logoText}>CP Tracker</span>
        </Link>
        <Link to="/register" style={s.navBtn}>Get started free</Link>
      </nav>

      <div style={s.content}>
        {/* Profile header */}
        <div style={s.profileCard}>
          <div style={s.avatar}>{profile.name[0].toUpperCase()}</div>
          <div style={s.profileInfo}>
            <h1 style={s.profileName}>{profile.name}</h1>
            <p style={s.profileMeta}>
              Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={s.streakBadge}>
            <span style={s.streakNum}>{profile.streak} 🔥</span>
            <span style={s.streakLabel}>day streak</span>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statBox}>
            <div style={s.statNum}>{connectedPlatforms.length}</div>
            <div style={s.statLabel}>Platforms</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>{profile.maxStreak}</div>
            <div style={s.statLabel}>Best Streak</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>{profile.streak}</div>
            <div style={s.statLabel}>Current Streak</div>
          </div>
        </div>

        {/* Connected platforms */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Connected Platforms</h2>
          {connectedPlatforms.length === 0 ? (
            <p style={s.emptyText}>No platforms connected yet</p>
          ) : (
            <div style={s.platformGrid}>
              {connectedPlatforms.map(p => (
                <a
                  key={p.key}
                  href={p.url + profile.handles[p.key]}
                  target="_blank"
                  rel="noreferrer"
                  style={s.platformCard}
                >
                  <span style={{ color: p.color }}>{p.icon}</span>
                  <div>
                    <div style={s.platformName}>{p.label}</div>
                    <div style={s.platformHandle}>@{profile.handles[p.key]}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={s.cta}>
          <p style={s.ctaText}>Track your own CP journey with CP Tracker</p>
          <Link to="/register" style={s.ctaBtn}>
            <FiAward size={16} />
            Get started free
          </Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0d1117', color: '#e6edf3' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #21262d' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoText: { fontSize: '1rem', fontWeight: '700', color: '#e6edf3' },
  navBtn: { background: '#1f6feb', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500' },
  content: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  loading: { textAlign: 'center', padding: '4rem', color: '#484f58' },
  notFound: { textAlign: 'center', padding: '4rem' },
  notFoundTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.5rem' },
  notFoundDesc: { color: '#8b949e', marginBottom: '1.5rem' },
  homeBtn: { background: '#1f6feb', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600' },

  profileCard: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '700', color: 'white', flexShrink: 0 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: '1.25rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.25rem' },
  profileMeta: { fontSize: '0.8rem', color: '#484f58' },
  streakBadge: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f59e0b18', border: '1px solid #f59e0b33', borderRadius: '8px', padding: '0.75rem 1rem' },
  streakNum: { fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b' },
  streakLabel: { fontSize: '0.7rem', color: '#8b949e' },

  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  statBox: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' },
  statNum: { fontSize: '1.5rem', fontWeight: '700', color: '#58a6ff', marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.75rem', color: '#484f58' },

  card: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '1rem' },
  emptyText: { color: '#484f58', fontSize: '0.875rem' },
  platformGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  platformCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '0.875rem' },
  platformName: { fontSize: '0.825rem', fontWeight: '500', color: '#c9d1d9' },
  platformHandle: { fontSize: '0.75rem', color: '#484f58', marginTop: '0.1rem' },

  cta: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  ctaText: { color: '#8b949e', fontSize: '0.875rem' },
  ctaBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600' },
};
