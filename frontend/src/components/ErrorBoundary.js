import { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Component error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={s.wrap}>
          <div style={s.box}>
            <FiAlertTriangle size={32} color="#f85149" style={s.icon} />
            <h2 style={s.title}>Something went wrong</h2>
            <p style={s.desc}>
              {this.props.fallback || 'This section failed to load. Please refresh the page.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={s.btn}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

const s = {
  wrap: { padding: '1.5rem' },
  box: { background: '#161b22', border: '1px solid #f8514933', borderRadius: '10px', padding: '2rem', textAlign: 'center' },
  icon: { marginBottom: '1rem' },
  title: { fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.5rem' },
  desc: { fontSize: '0.875rem', color: '#8b949e', marginBottom: '1.5rem' },
  btn: { background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
};