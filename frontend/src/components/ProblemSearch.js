import { useState } from 'react';
import api from '../utils/api';
import { FiSearch, FiExternalLink, FiFilter } from 'react-icons/fi';

export default function ProblemSearch() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query && platform === 'all' && difficulty === 'all') return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (platform !== 'all') params.append('platform', platform);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      const res = await api.get(`/problems/search?${params.toString()}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search();
  };

  const getPlatformColor = (p) => ({
    leetcode: '#ffa116',
    codeforces: '#3b82f6',
    codechef: '#8b5cf6'
  }[p] || '#58a6ff');

  const getDiffColor = (d) => d === 'easy' ? '#3fb950' : d === 'medium' ? '#d29922' : '#f85149';

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Problem Search</h2>
          <p style={s.sub}>Search through 14,000+ problems</p>
        </div>
        <FiSearch size={18} color="#58a6ff" />
      </div>

      <div style={s.searchRow}>
        <div style={s.searchBox}>
          <FiSearch size={14} color="#484f58" style={s.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={s.searchInput}
            placeholder="Search by title or topic..."
          />
        </div>
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          style={s.select}
        >
          <option value="all">All Platforms</option>
          <option value="leetcode">LeetCode</option>
          <option value="codeforces">Codeforces</option>
        </select>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          style={s.select}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={search} style={s.searchBtn} disabled={loading}>
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {loading && (
        <div style={s.skeleton}>
          {[1,2,3,4,5].map(i => <div key={i} style={s.skeletonRow} />)}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div style={s.empty}>No problems found. Try different keywords.</div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={s.resultsHeader}>
            <span style={s.resultsCount}>{results.length} problems found</span>
          </div>
          <div style={s.resultsList}>
            {results.map((p, i) => (
              <div key={p._id} style={s.resultRow}>
                <span style={s.resultNum}>{i + 1}</span>
                <span style={{
                  ...s.platformTag,
                  background: getPlatformColor(p.platform) + '18',
                  color: getPlatformColor(p.platform),
                  border: `1px solid ${getPlatformColor(p.platform)}33`
                }}>
                  {p.platform.slice(0,2).toUpperCase()}
                </span>
                <div style={s.resultInfo}>
                  <span style={s.resultTitle}>{p.title}</span>
                  {p.tags && p.tags.length > 0 && (
                    <div style={s.tagRow}>
                      {p.tags.slice(0,3).map(tag => (
                        <span key={tag} style={s.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {p.cf_rating && <span style={s.cfRating}>{p.cf_rating}</span>}
                <span style={{ ...s.diffBadge, color: getDiffColor(p.difficulty) }}>
                  {p.difficulty}
                </span>
                <a href={p.url} target="_blank" rel="noreferrer" style={s.solveBtn}>
                  Solve <FiExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {!searched && (
        <div style={s.hint}>
          <FiFilter size={24} color="#30363d" style={{marginBottom: '0.5rem'}} />
          <p>Search by problem title, topic tag, or filter by platform and difficulty</p>
        </div>
      )}
    </div>
  );
}

const s = {
  section: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', color: '#f0f6fc', marginBottom: '0.2rem' },
  sub: { fontSize: '0.75rem', color: '#484f58' },
  searchRow: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  searchBox: { position: 'relative', flex: 1, minWidth: '200px' },
  searchIcon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' },
  searchInput: { width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '0.625rem 0.875rem 0.625rem 2.25rem', color: '#e6edf3', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  select: { background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#e6edf3', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' },
  searchBtn: { background: '#1f6feb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  resultsHeader: { marginBottom: '0.75rem' },
  resultsCount: { fontSize: '0.8rem', color: '#484f58' },
  resultsList: { display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '400px', overflowY: 'auto' },
  resultRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d' },
  resultNum: { fontSize: '0.7rem', color: '#484f58', width: '20px', flexShrink: 0 },
  platformTag: { fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.4rem', borderRadius: '3px', flexShrink: 0 },
  resultInfo: { flex: 1, minWidth: 0 },
  resultTitle: { fontSize: '0.825rem', color: '#c9d1d9', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tagRow: { display: 'flex', gap: '0.25rem', marginTop: '0.2rem' },
  tag: { fontSize: '0.6rem', background: '#21262d', color: '#484f58', padding: '0.1rem 0.35rem', borderRadius: '3px' },
  cfRating: { fontSize: '0.7rem', color: '#484f58', flexShrink: 0 },
  diffBadge: { fontSize: '0.75rem', fontWeight: '500', textTransform: 'capitalize', flexShrink: 0 },
  solveBtn: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', background: '#1f6feb', color: 'white', padding: '0.25rem 0.625rem', borderRadius: '4px', fontWeight: '500', flexShrink: 0 },
  skeleton: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  skeletonRow: { height: '48px', borderRadius: '6px', background: 'linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.5s infinite' },
  empty: { color: '#484f58', fontSize: '0.875rem', padding: '1.5rem 0', textAlign: 'center' },
  hint: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', color: '#484f58', fontSize: '0.8rem', textAlign: 'center' },
};