import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiZap, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <Link to="/" style={s.logo}>
          <FiZap size={20} color="#58a6ff" />
          <span style={s.logoText}>CP Tracker</span>
        </Link>
        <div style={s.leftContent}>
          <h2 style={s.leftTitle}>Start tracking your CP journey today.</h2>
          <p style={s.leftDesc}>Connect your platforms, get AI recommendations, and improve systematically.</p>
          <div style={s.features}>
            {[
              '✦ Track 6 platforms in one place',
              '✦ AI-powered daily problem recommendations',
              '✦ Topic-wise strength analysis',
              '✦ Free forever, no credit card needed',
            ].map(f => (
              <div key={f} style={s.feature}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <h1 style={s.title}>Create your account</h1>
          <p style={s.subtitle}>Start tracking your progress today</p>

          <button onClick={handleGoogle} style={s.googleBtn} disabled={googleLoading}>
            <FcGoogle size={20} />
            {googleLoading ? 'Creating account...' : 'Sign up with Google'}
          </button>

          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <div style={s.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <div style={s.inputWrap}>
                <FiUser size={16} color="#484f58" style={s.inputIcon} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={s.input} placeholder="Gaurav Jain" required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <div style={s.inputWrap}>
                <FiMail size={16} color="#484f58" style={s.inputIcon} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={s.input} placeholder="you@example.com" required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <FiLock size={16} color="#484f58" style={s.inputIcon} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={s.input} placeholder="Min 6 characters" required />
              </div>
            </div>
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          <p style={s.footer}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh', background: '#0d1117' },
  left: { flex: 1, background: '#161b22', borderRight: '1px solid #21262d', padding: '2.5rem', display: 'flex', flexDirection: 'column' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'auto' },
  logoText: { fontSize: '1.1rem', fontWeight: '700', color: '#e6edf3' },
  leftContent: { marginBottom: '4rem' },
  leftTitle: { fontSize: '2rem', fontWeight: '700', color: '#f0f6fc', lineHeight: '1.3', marginBottom: '1rem' },
  leftDesc: { color: '#8b949e', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '2rem' },
  features: { display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  feature: { color: '#8b949e', fontSize: '0.9rem', lineHeight: '1.5' },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { width: '100%', maxWidth: '400px' },
  title: { fontSize: '1.75rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '0.5rem' },
  subtitle: { color: '#8b949e', fontSize: '0.9rem', marginBottom: '2rem' },
  googleBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: '#21262d', border: '1px solid #30363d', color: '#e6edf3', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', marginBottom: '1.5rem' },
  divider: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  dividerLine: { flex: 1, height: '1px', background: '#21262d' },
  dividerText: { color: '#484f58', fontSize: '0.8rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#8b949e' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' },
  input: { width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '0.75rem 0.875rem 0.75rem 2.5rem', color: '#e6edf3', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#8b949e', fontSize: '0.875rem' },
  link: { color: '#58a6ff', fontWeight: '500' },
};