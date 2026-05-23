import { Link } from 'react-router-dom';
import { FiCode, FiTrendingUp, FiTarget, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi';
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si';

export default function Landing() {
  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo}>
            <FiZap size={20} color="#58a6ff" />
            <span style={s.logoText}>CP Tracker</span>
          </div>
          <div style={s.navLinks}>
            <a href="#features" style={s.navLink}>Features</a>
            <a href="#platforms" style={s.navLink}>Platforms</a>
            <Link to="/login" style={s.navBtn}>Sign in</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>
            <FiZap size={12} color="#58a6ff" />
            <span>AI-powered problem recommendations</span>
          </div>
          <h1 style={s.heroTitle}>
            Track your CP journey.<br />
            <span style={s.heroHighlight}>All platforms. One dashboard.</span>
          </h1>
          <p style={s.heroDesc}>
            Aggregate your LeetCode, Codeforces, CodeChef and more stats in one place.
            Get personalized daily problem recommendations based on your weak areas.
          </p>
          <div style={s.heroBtns}>
            <Link to="/register" style={s.primaryBtn}>
              Get started free
              <FiArrowRight size={16} />
            </Link>
            <Link to="/login" style={s.secondaryBtn}>
              Sign in
            </Link>
          </div>
          <p style={s.heroNote}>Free forever · No credit card required</p>
        </div>

        {/* Stats preview */}
        <div style={s.statsPreview}>
          <div style={s.previewCard}>
            <div style={s.previewHeader}>
              <div style={s.previewDot} />
              <div style={s.previewDot} />
              <div style={s.previewDot} />
              <span style={s.previewTitle}>Dashboard</span>
            </div>
            <div style={s.previewStats}>
              {[
                { label: 'Total Solved', value: '847', color: '#58a6ff' },
                { label: 'LeetCode', value: '412', color: '#ffa116' },
                { label: 'Codeforces', value: '1847', color: '#3b82f6' },
                { label: 'HackerRank', value: '156', color: '#00ea64' },
              ].map(stat => (
                <div key={stat.label} style={s.previewStat}>
                  <div style={s.previewStatLabel}>{stat.label}</div>
                  <div style={{ ...s.previewStatValue, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={s.previewProblems}>
              <div style={s.previewProblemTitle}>🎯 Today's Problems</div>
              {[
                { name: 'Climbing Stairs', platform: 'LC', diff: 'Easy', color: '#22c55e' },
                { name: 'Segment Tree', platform: 'CF', diff: 'Medium', color: '#f59e0b' },
                { name: 'Graph BFS', platform: 'LC', diff: 'Medium', color: '#f59e0b' },
              ].map((p, i) => (
                <div key={i} style={s.previewProblem}>
                  <span style={s.previewPlatform}>{p.platform}</span>
                  <span style={s.previewProblemName}>{p.name}</span>
                  <span style={{ ...s.previewDiff, color: p.color }}>{p.diff}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" style={s.platforms}>
        <p style={s.platformsLabel}>Supports all major platforms</p>
        <div style={s.platformIcons}>
          <div style={s.platformIcon}>
            <SiLeetcode size={28} color="#ffa116" />
            <span>LeetCode</span>
          </div>
          <div style={s.platformIcon}>
            <SiCodeforces size={28} color="#3b82f6" />
            <span>Codeforces</span>
          </div>
          <div style={s.platformIcon}>
            <SiCodechef size={28} color="#8b5cf6" />
            <span>CodeChef</span>
          </div>
          <div style={s.platformIcon}>
            <FiCode size={28} color="#22c55e" />
            <span>GeeksForGeeks</span>
          </div>
          <div style={s.platformIcon}>
            <FiCode size={28} color="#00ea64" />
            <span>HackerRank</span>
          </div>
          <div style={s.platformIcon}>
            <FiCode size={28} color="#2c99e8" />
            <span>HackerEarth</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={s.features}>
        <div style={s.featuresInner}>
          <h2 style={s.sectionTitle}>Everything you need to level up</h2>
          <p style={s.sectionDesc}>Built for serious competitive programmers who want to track and improve systematically</p>
          <div style={s.featureGrid}>
            {[
              {
                icon: <FiTrendingUp size={24} color="#58a6ff" />,
                title: 'Unified Stats',
                desc: 'See all your platform stats in one beautiful dashboard. No more switching between tabs.'
              },
              {
                icon: <FiTarget size={24} color="#58a6ff" />,
                title: 'AI Recommendations',
                desc: 'Our engine analyzes your weak topics and recommends exactly what problems to solve today.'
              },
              {
                icon: <FiZap size={24} color="#58a6ff" />,
                title: 'Daily Problem Feed',
                desc: 'Get 5 curated problems every day targeting your weakest areas across all platforms.'
              },
              {
                icon: <FiCode size={24} color="#58a6ff" />,
                title: 'Topic Breakdown',
                desc: 'Visualize your strength and weakness across 30+ topics with beautiful progress bars.'
              },
            ].map((f, i) => (
              <div key={i} style={s.featureCard}>
                <div style={s.featureIcon}>{f.icon}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>Ready to level up your CP journey?</h2>
          <p style={s.ctaDesc}>Join hundreds of students already tracking their progress</p>
          <Link to="/register" style={s.primaryBtn}>
            Get started free
            <FiArrowRight size={16} />
          </Link>
          <div style={s.ctaChecks}>
            {['Free forever', 'No credit card', '6 platforms supported'].map(item => (
              <div key={item} style={s.ctaCheck}>
                <FiCheck size={14} color="#22c55e" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.logo}>
            <FiZap size={16} color="#58a6ff" />
            <span style={s.logoText}>CP Tracker</span>
          </div>
          <p style={s.footerText}>Built for competitive programmers, by a competitive programmer.</p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page: { background: '#0d1117', minHeight: '100vh', color: '#e6edf3' },

  // Nav
  nav: { borderBottom: '1px solid #21262d', position: 'sticky', top: 0, background: '#0d1117cc', backdropFilter: 'blur(12px)', zIndex: 100 },
  navInner: { maxWidth: '1100px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoText: { fontSize: '1.1rem', fontWeight: '700', color: '#e6edf3' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink: { color: '#8b949e', fontSize: '0.9rem', transition: 'color 0.2s' },
  navBtn: { background: '#21262d', border: '1px solid #30363d', color: '#e6edf3', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500' },

  // Hero
  hero: { maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem', display: 'flex', alignItems: 'center', gap: '4rem' },
  heroInner: { flex: 1 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1f2937', border: '1px solid #30363d', borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#8b949e', marginBottom: '1.5rem' },
  heroTitle: { fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.25rem', color: '#f0f6fc' },
  heroHighlight: { color: '#58a6ff' },
  heroDesc: { fontSize: '1.1rem', color: '#8b949e', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '480px' },
  heroBtns: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' },
  primaryBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1f6feb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', border: 'none', cursor: 'pointer' },
  secondaryBtn: { color: '#8b949e', fontSize: '0.95rem', padding: '0.75rem 1rem' },
  heroNote: { fontSize: '0.8rem', color: '#484f58' },

  // Preview card
  statsPreview: { flex: 1, display: 'flex', justifyContent: 'center' },
  previewCard: { background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '1.25rem', width: '340px', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' },
  previewHeader: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' },
  previewDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#30363d' },
  previewTitle: { fontSize: '0.8rem', color: '#484f58', marginLeft: '0.5rem' },
  previewStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' },
  previewStat: { background: '#0d1117', borderRadius: '8px', padding: '0.75rem' },
  previewStatLabel: { fontSize: '0.7rem', color: '#484f58', marginBottom: '0.25rem' },
  previewStatValue: { fontSize: '1.5rem', fontWeight: '700' },
  previewProblems: { background: '#0d1117', borderRadius: '8px', padding: '0.875rem' },
  previewProblemTitle: { fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem', color: '#8b949e' },
  previewProblem: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  previewPlatform: { fontSize: '0.65rem', background: '#1f6feb22', color: '#58a6ff', padding: '0.15rem 0.4rem', borderRadius: '3px', fontWeight: '600' },
  previewProblemName: { fontSize: '0.8rem', color: '#c9d1d9', flex: 1 },
  previewDiff: { fontSize: '0.75rem', fontWeight: '500' },

  // Platforms
  platforms: { borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d', padding: '2rem', textAlign: 'center' },
  platformsLabel: { color: '#484f58', fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
  platformIcons: { display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' },
  platformIcon: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.8rem' },

  // Features
  features: { padding: '5rem 2rem' },
  featuresInner: { maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.75rem', color: '#f0f6fc' },
  sectionDesc: { color: '#8b949e', textAlign: 'center', marginBottom: '3rem', fontSize: '1rem' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' },
  featureCard: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  featureIcon: { background: '#1f2937', borderRadius: '8px', padding: '0.625rem', display: 'inline-flex', marginBottom: '1rem' },
  featureTitle: { fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#f0f6fc' },
  featureDesc: { fontSize: '0.875rem', color: '#8b949e', lineHeight: '1.6' },

  // CTA
  cta: { background: '#161b22', borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d', padding: '5rem 2rem', textAlign: 'center' },
  ctaInner: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem', color: '#f0f6fc' },
  ctaDesc: { color: '#8b949e', marginBottom: '2rem' },
  ctaChecks: { display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' },
  ctaCheck: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b949e', fontSize: '0.875rem' },

  // Footer
  footer: { padding: '2rem', borderTop: '1px solid #21262d' },
  footerInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  footerText: { color: '#484f58', fontSize: '0.875rem' },
};