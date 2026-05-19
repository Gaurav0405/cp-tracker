import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const [handles, setHandles] = useState({
    leetcode: '', codeforces: '', codechef: '',
    geeksforgeeks: '', hackerrank: '', hackerearth: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/stats');
      if (res.data.handles) {
        setHandles(res.data.handles);
      }
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
      toast.success('Handles saved!');
    } catch (err) {
      toast.error('Failed to save handles');
    } finally {
      setSaving(false);
    }
  };

  const platforms = [
    { key: 'leetcode', label: 'LeetCode', color: '#f89f1b', placeholder: 'e.g. GauravJain0405' },
    { key: 'codeforces', label: 'Codeforces', color: '#3b82f6', placeholder: 'e.g. tourist' },
    { key: 'codechef', label: 'CodeChef', color: '#8b5cf6', placeholder: 'e.g. gauravjain' },
    { key: 'geeksforgeeks', label: 'GeeksForGeeks', color: '#22c55e', placeholder: 'e.g. gauravjain' },
    { key: 'hackerrank', label: 'HackerRank', color: '#00ea64', placeholder: 'e.g. jain_gaurav0405' },
    { key: 'hackerearth', label: 'HackerEarth', color: '#2c99e8', placeholder: 'e.g. gauravjain' },
  ];

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.navLogo}>⚡ CP Tracker</Link>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 {user && user.name}</span>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Profile Settings</h1>
          <p style={styles.subtitle}>Connect your coding platforms to get personalised recommendations</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔗 Platform Handles</h2>
          <p style={styles.cardSubtitle}>Enter your username on each platform. Leave blank to skip.</p>

          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <div style={styles.platformGrid}>
              {platforms.map(p => (
                <div key={p.key} style={styles.platformItem}>
                  <div style={styles.platformHeader}>
                    <span style={{
                      ...styles.platformDot,
                      background: p.color
                    }} />
                    <label style={styles.platformLabel}>{p.label}</label>
                  </div>
                  <input
                    type="text"
                    value={handles[p.key] || ''}
                    onChange={e => setHandles({...handles, [p.key]: e.target.value})}
                    style={styles.input}
                    placeholder={p.placeholder}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSave}
            style={styles.saveBtn}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Handles'}
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👤 Account Info</h2>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Name</span>
            <span style={styles.infoValue}>{user && user.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{user && user.email}</span>
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
  content: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: '700', color: '#f1f5f9' },
  subtitle: { color: '#64748b', marginTop: '0.5rem' },
  card: {
    background: '#1a1d2e', border: '1px solid #2d3148',
    borderRadius: '12px', padding: '1.75rem', marginBottom: '1.5rem'
  },
  cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '0.5rem' },
  cardSubtitle: { color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem' },
  loading: { color: '#475569', padding: '1rem 0' },
  platformGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem'
  },
  platformItem: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  platformHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  platformDot: { width: '8px', height: '8px', borderRadius: '50%' },
  platformLabel: { fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8' },
  input: {
    background: '#0f1117', border: '1px solid #2d3148',
    borderRadius: '8px', padding: '0.625rem 0.875rem',
    color: '#f1f5f9', fontSize: '0.875rem', outline: 'none'
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white', border: 'none', borderRadius: '8px',
    padding: '0.75rem 1.5rem', fontSize: '0.95rem',
    fontWeight: '600', cursor: 'pointer'
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 0', borderBottom: '1px solid #1e2235'
  },
  infoLabel: { color: '#64748b', fontSize: '0.875rem' },
  infoValue: { color: '#f1f5f9', fontSize: '0.875rem', fontWeight: '500' }
};