import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiZap, FiGrid, FiUser, FiLogOut, FiSave, FiExternalLink } from 'react-icons/fi';
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si';
import { FiCode } from 'react-icons/fi';

export default function Profile() {
  const { user, logout } = useAuth();
  const [handles, setHandles] = useState({
    leetcode: '', codeforces: '', codechef: '',
    geeksforgeeks: '', hackerrank: '', hackerearth: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/stats');
      if (res.data.handles) setHandles(res.data.handles);
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

  const platforms = [
    { key: 'leetcode', label: 'LeetCode', color: '#ffa116', icon: <SiLeetcode size={18} />, url: 'https://leetcode.com/', placeholder: 'e.g. GauravJain0405' },
    { key: 'codeforces', label: 'Codeforces', color: '#3b82f6', icon: <SiCodeforces size={18} />, url: 'https://codeforces.com/profile/', placeholder: 'e.g. tourist' },
    { key: 'codechef', label: 'CodeChef', color: '#8b5cf6', icon: <SiCodechef size={18} />, url: 'https://www.codechef.com/users/', placeholder: 'e.g. gauravjain' },
    { key: 'geeksforgeeks', label: 'GeeksForGeeks', color: '#3fb950', icon: <FiCode size={18} />, url: 'https://auth.geeksforgeeks.org/user/', placeholder: 'e.g. gauravjain' },
    { key: 'hackerrank', label: 'HackerRank', color: '#00ea64', icon: <FiCode size={18} />, url: 'https://www.hackerrank.com/', placeholder: 'e.g. jain_gaurav0405' },
    { key: 'hackerearth', label: 'HackerEarth', color: '#2c99e8', icon: <FiCode size={18} />, url: 'https://www.hackerearth.com/@', placeholder: 'e.g. gauravjain' },
  ];

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
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.userEmail}>{user?.email?.split('@')[0]}</div>
            </div>
          </div>
          <button onClick={logout} style={s.logoutBtn}>
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
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

        {/* Account card */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Account Information</h2>
          <div style={s.accountInfo}>
            <div style={s.bigAvatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={s.accountName}>{user?.name}</div>
              <div style={s.accountEmail}>{user?.email}</div>
              <div style={s.accountProvider}>
                {user?.authProvider === 'google' ? '🔗 Connected via Google' : '📧 Email account'}
              </div>
            </div>
          </div>
        </div>

        {/* Handles card */}
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
                      <a
                        href={p.url + handles[p.key]}
                        target="_blank"
                        rel="noreferrer"
                        style={s.platformLink}
                      >
                        <FiExternalLink size={12} />
                      </a>
                    )}
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
  userName: { fontSize: '0.8rem', fontWeight: '600', color: '#e6edf3' },
  userEmail: { fontSize: '0.75rem', color: '#484f58' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem 0' },

  main: { marginLeft: '220px', flex: 1, padding: '2rem', maxWidth: 'calc(100vw - 220px)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  headerTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.25rem' },
  headerSub: { color: '#8b949e', fontSize: '0.875rem' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },

  card: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.75rem', marginBottom: '1.25rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.5rem' },
  cardDesc: { color: '#8b949e', fontSize: '0.875rem', marginBottom: '1.5rem' },

  accountInfo: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  bigAvatar: { width: '56px', height: '56px', borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '700', color: 'white', flexShrink: 0 },
  accountName: { fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  accountEmail: { fontSize: '0.875rem', color: '#8b949e', marginBottom: '0.3rem' },
  accountProvider: { fontSize: '0.75rem', color: '#484f58' },

  platformGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  platformCard: { background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '1rem' },
  platformHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' },
  platformLabel: { fontSize: '0.875rem', fontWeight: '500', color: '#8b949e', flex: 1 },
  platformLink: { color: '#484f58' },
  input: { width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#e6edf3', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },

  loadingText: { color: '#484f58', padding: '1rem 0' },
  saveBtnBottom: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
};