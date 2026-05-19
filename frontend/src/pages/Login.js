import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡ CP Tracker</div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Track your competitive programming journey</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)',
    padding: '1rem'
  },
  card: {
    background: '#1a1d2e',
    border: '1px solid #2d3148',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#94a3b8'
  },
  input: {
    background: '#0f1117',
    border: '1px solid #2d3148',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#f1f5f9',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s'
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#64748b',
    fontSize: '0.9rem'
  },
  link: {
    color: '#6366f1',
    fontWeight: '500'
  }
};