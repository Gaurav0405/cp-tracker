import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiZap, FiGrid, FiUser, FiLogOut, FiSave, FiExternalLink, FiAward, FiTrendingUp, FiCode } from 'react-icons/fi';
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [handles, setHandles] = useState({
    leetcode: '', codeforces: '', codechef: '',
    geeksforgeeks: '', hackerrank: '', hackerearth: ''
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user && user.avatar ? user.avatar : '');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/stats');
      if (res.data.handles) setHandles(res.data.handles);
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/user/handles', handles);
      toast.success('Handles saved successfully!');
    } catch (err) {
      toast.error('Failed to save handles');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500000) {
      toast.error('Image too large. Max 500KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setAvatarLoading(true);
      try {
        const res = await api.post('/user/avatar', { avatar: base64 });
        toast.success('Profile picture updated!');
        setCurrentAvatar(res.data.avatar);
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        savedUser.avatar = res.data.avatar;
        localStorage.setItem('user', JSON.stringify(savedUser));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to upload');
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const platforms = [
    { key: 'leetcode', label: 'LeetCode', color: '#ffa116', icon: <SiLeetcode size={18} />, url: 'https://leetcode.com/', placeholder: 'e.g. GauravJain0405' },
    { key: 'codeforces', label: 'Codeforces', color: '#3b82f6', icon: <SiCodeforces size={18} />, url: 'https://codeforces.com/profile/', placeholder: 'e.g. tourist' },
    { key: 'codechef', label: 'CodeChef', color: '#8b5cf6', icon: <SiCodechef size={18} />, url: 'https://www.codechef.com/users/', placeholder: 'e.g. gauravjain' },
    { key: 'geeksforgeeks', label: 'GeeksForGeeks', color: '#3fb950', icon: <FiCode size={18} />, url: 'https://auth.geeksforgeeks.org/user/', placeholder: 'e.g. gauravjain' },
    { key: 'hackerrank', label: 'HackerRank', color: '#00ea64', icon: <FiCode size={18} />, url: 'https://www.hackerrank.com/', placeholder: 'e.g. jain_gaurav0405' },
    { key: 'hackerearth', label: 'HackerEarth', color: '#2c99e8', icon: <FiCode size={18} />, url: 'https://www.hackerearth.com/@', placeholder: 'e.g. gauravjain' },
  ];

  const connectedCount = platforms.filter(p => handles[p.key]).length;

  return (
    <div style={s.layout}>
      <aside style={s.sidebar}>
        <div style={s.sidebarTop}>
          <Link to="/" style={s.logo}>
            <FiZap size={18} color="#58a6ff" />
            <span style={s.logoText}>CP Tracker</span>
          </Link>
          <nav style={s.nav}>
            <Link to="/dashboard" style={s.navItemLink}>
              <FiGrid size={16} />
              <span>Dashboard</span>
            </Link>
            <div style={s.navItem}>
              <FiUser size={16} />
              <span>Profile</span>
            </div>
          </nav>
        </div>
        <div style={s.sidebarBottom}>
          <div style={s.userInfo}>
            {currentAvatar ? (
              <img src={currentAvatar} alt="avatar" style={s.avatarImg} />
            ) : (
              <div style={s.avatar}>{user && user.name ? user.name[0].toUpperCase() : 'U'}</div>
            )}
            <div>
              <div style={s.userName}>{user && user.name}</div>
              <div style={s.userEmail}>{user && user.email ? user.email.split('@')[0] : ''}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main style={s.main}>
        <div style={s.header}>
          <div>
            <h1 style={s.headerTitle}>Profile Settings</h1>
            <p style={s.headerSub}>Connect your coding platforms to get personalised recommendations</p>
          </div>
          <button onClick={handleSave} style={s.saveBtn} disabled={saving}>
            <FiSave size={15} />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div style={s.statsRow}>
            {[
              { label: 'Total Solved', value: stats.totalSolved || 0, icon: <FiAward size={16} />, color: '#58a6ff' },
              { label: 'Current Streak', value: `${stats.streak || 0} 🔥`, icon: <FiZap size={16} />, color: '#f59e0b' },
              { label: 'Best Streak', value: `${stats.maxStreak || 0} days`, icon: <FiTrendingUp size={16} />, color: '#3fb950' },
              { label: 'Platforms', value: `${connectedCount}/6`, icon: <FiCode size={16} />, color: '#8b5cf6' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statCardHeader}>
                  <span style={s.statLabel}>{stat.label}</span>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Account Info */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Account Information</h2>
          <div style={s.accountInfo}>
            <div style={s.avatarWrap}>
              {currentAvatar ? (
                <img src={currentAvatar} alt="avatar" style={s.bigAvatarImg} />
              ) : (
                <div style={s.bigAvatar}>{user && user.name ? user.name[0].toUpperCase() : 'U'}</div>
              )}
              <label style={s.avatarUploadBtn} title="Change photo">
                {avatarLoading ? '⌛' : '📷'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div>
              <div style={s.accountName}>{user && user.name}</div>
              <div style={s.accountEmail}>{user && user.email}</div>
              <div style={s.accountProvider}>
                {user && user.authProvider === 'google' ? '🔗 Connected via Google' : '📧 Email account'}
              </div>
              <div style={s.avatarHint}>Click the camera icon to change your photo (max 500KB)</div>
            </div>
          </div>
        </div>

        {/* Platform Handles */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Platform Handles</h2>
          <p style={s.cardDesc}>Enter your username on each platform. Leave blank to skip.</p>
          {loading ? (
            <div style={s.loadingText}>Loading your handles...</div>
          ) : (
            <div style={s.platformGrid}>
              {platforms.map(p => (
                <div key={p.key} style={s.platformCard}>
                  <div style={s.platformHeader}>
                    <span style={{ color: p.color }}>{p.icon}</span>
                    <span style={s.platformLabel}>{p.label}</span>
                    {handles[p.key] && (
                      <a href={p.url + handles[p.key]} target="_blank" rel="noreferrer" style={s.platformLink}>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {handles[p.key] && <span style={s.connectedDot}>●</span>}
                  </div>
                  <input
                    type="text"
                    value={handles[p.key] || ''}
                    onChange={e => setHandles({ ...handles, [p.key]: e.target.value })}
                    style={s.input}
                    placeholder={p.placeholder}
                  />
                </div>
              ))}
            </div>
          )}
          <button onClick={handleSave} style={s.saveBtnBottom} disabled={saving}>
            <FiSave size={15} />
            {saving ? 'Saving...' : 'Save all handles'}
          </button>
        </div>
      </main>
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0d1117' },
  sidebar: { width: '220px', background: '#161b22', borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'fixed', height: '100vh', padding: '1.25rem 0' },
  sidebarTop: { padding: '0 1rem' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' },
  logoText: { fontSize: '1rem', fontWeight: '700', color: '#e6edf3' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '6px', color: '#e6edf3', fontSize: '0.875rem', fontWeight: '500', background: '#21262d', cursor: 'pointer' },
  navItemLink: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '6px', color: '#8b949e', fontSize: '0.875rem', cursor: 'pointer' },
  sidebarBottom: { padding: '0 1rem', borderTop: '1px solid #21262d', paddingTop: '1rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'white', flexShrink: 0 },
  avatarImg: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  userName: { fontSize: '0.8rem', fontWeight: '600', color: '#e6edf3' },
  userEmail: { fontSize: '0.75rem', color: '#484f58' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem 0' },
  main: { marginLeft: '220px', flex: 1, padding: '2rem', maxWidth: 'calc(100vw - 220px)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  headerTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.25rem' },
  headerSub: { color: '#8b949e', fontSize: '0.875rem' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.25rem' },
  statCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  statLabel: { fontSize: '0.75rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' },
  statValue: { fontSize: '1.5rem', fontWeight: '700' },
  card: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.75rem', marginBottom: '1.25rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.5rem' },
  cardDesc: { color: '#8b949e', fontSize: '0.875rem', marginBottom: '1.5rem' },
  accountInfo: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  bigAvatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', color: 'white' },
  bigAvatarImg: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' },
  avatarUploadBtn: { position: 'absolute', bottom: '-2px', right: '-2px', background: '#21262d', border: '1px solid #30363d', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem' },
  avatarHint: { fontSize: '0.7rem', color: '#484f58', marginTop: '0.4rem' },
  accountName: { fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  accountEmail: { fontSize: '0.875rem', color: '#8b949e', marginBottom: '0.3rem' },
  accountProvider: { fontSize: '0.75rem', color: '#484f58' },
  platformGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  platformCard: { background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '1rem' },
  platformHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' },
  platformLabel: { fontSize: '0.875rem', fontWeight: '500', color: '#8b949e', flex: 1 },
  platformLink: { color: '#484f58' },
  connectedDot: { color: '#3fb950', fontSize: '0.6rem' },
  input: { width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#e6edf3', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  loadingText: { color: '#484f58', padding: '1rem 0' },
  saveBtnBottom: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
};