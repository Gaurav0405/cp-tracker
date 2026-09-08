import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiUserPlus, FiUserMinus, FiAward } from 'react-icons/fi';

export default function FriendLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => searchUsers(), 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/friends/leaderboard');
      setLeaderboard(res.data.leaderboard);
      setFriendIds(res.data.friendIds);
    } catch (err) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    setSearching(true);
    try {
      const res = await api.get(`/friends/search?q=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const addFriend = async (friendId, name) => {
    try {
      await api.post(`/friends/add/${friendId}`);
      toast.success(`Added ${name}!`);
      setFriendIds([...friendIds, friendId]);
      fetchLeaderboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add friend');
    }
  };

  const removeFriend = async (friendId, name) => {
    try {
      await api.delete(`/friends/remove/${friendId}`);
      toast.success(`Removed ${name}`);
      setFriendIds(friendIds.filter(id => id !== friendId));
      fetchLeaderboard();
    } catch (err) {
      toast.error('Failed to remove friend');
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 0) return '#ffd700';
    if (rank === 1) return '#c0c0c0';
    if (rank === 2) return '#cd7f32';
    return '#484f58';
  };

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Friend Leaderboard</h2>
          <p style={s.sub}>Compare your progress with friends</p>
        </div>
        <FiAward size={18} color="#58a6ff" />
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <div style={s.searchBox}>
          <FiSearch size={14} color="#484f58" style={s.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={s.searchInput}
            placeholder="Search users to add as friends..."
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={s.searchResults}>
            {searchResults.map(u => (
              <div key={u._id} style={s.searchResult}>
                <div style={s.searchAvatar}>{u.name[0].toUpperCase()}</div>
                <div style={s.searchInfo}>
                  <div style={s.searchName}>{u.name}</div>
                  <div style={s.searchMeta}>{u.totalSolved} solved · {u.streak}🔥 streak</div>
                </div>
                {friendIds.includes(u._id) ? (
                  <button onClick={() => removeFriend(u._id, u.name)} style={s.removeBtn}>
                    <FiUserMinus size={14} />
                  </button>
                ) : (
                  <button onClick={() => addFriend(u._id, u.name)} style={s.addBtn}>
                    <FiUserPlus size={14} />
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {searching && <div style={s.searchingText}>Searching...</div>}
        {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
          <div style={s.searchingText}>No users found</div>
        )}
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div style={s.skeleton}>
          {[1,2,3].map(i => <div key={i} style={s.skeletonRow} />)}
        </div>
      ) : leaderboard.length === 0 ? (
        <div style={s.empty}>Search and add friends to see the leaderboard!</div>
      ) : (
        <div style={s.list}>
          {leaderboard.map((entry, i) => (
            <div key={entry._id} style={{
              ...s.row,
              background: entry.isMe ? '#1f6feb11' : '#0d1117',
              border: entry.isMe ? '1px solid #1f6feb33' : '1px solid #21262d'
            }}>
              <div style={{ ...s.rank, color: getMedalColor(i) }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </div>
              <div style={s.avatar}>{entry.name[0].toUpperCase()}</div>
              <div style={s.info}>
                <div style={s.name}>
                  {entry.name}
                  {entry.isMe && <span style={s.youBadge}>you</span>}
                </div>
                <div style={s.meta}>{entry.streak}🔥 streak</div>
              </div>
              <div style={s.solved}>
                <div style={s.solvedNum}>{entry.totalSolved}</div>
                <div style={s.solvedLabel}>solved</div>
              </div>
              {!entry.isMe && (
                <button
                  onClick={() => removeFriend(entry._id, entry.name)}
                  style={s.removeBtnSmall}
                >
                  <FiUserMinus size={12} />
                </button>
              )}
            </div>
          ))}
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

  searchWrap: { marginBottom: '1.25rem' },
  searchBox: { position: 'relative', marginBottom: '0.5rem' },
  searchIcon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' },
  searchInput: { width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '0.625rem 0.875rem 0.625rem 2.25rem', color: '#e6edf3', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  searchResults: { background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', overflow: 'hidden' },
  searchResult: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderBottom: '1px solid #21262d' },
  searchAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'white', flexShrink: 0 },
  searchInfo: { flex: 1 },
  searchName: { fontSize: '0.825rem', fontWeight: '500', color: '#c9d1d9' },
  searchMeta: { fontSize: '0.75rem', color: '#484f58', marginTop: '0.1rem' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#1f6feb', color: 'white', border: 'none', borderRadius: '6px', padding: '0.3rem 0.625rem', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', flexShrink: 0 },
  removeBtn: { background: '#f8514911', color: '#f85149', border: '1px solid #f8514933', borderRadius: '6px', padding: '0.3rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  searchingText: { fontSize: '0.8rem', color: '#484f58', padding: '0.5rem 0' },

  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  row: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px' },
  rank: { fontSize: '1rem', width: '28px', textAlign: 'center', flexShrink: 0 },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#8b949e', flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: '0.875rem', fontWeight: '500', color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  youBadge: { fontSize: '0.65rem', background: '#1f6feb22', color: '#58a6ff', padding: '0.1rem 0.4rem', borderRadius: '10px', border: '1px solid #1f6feb33' },
  meta: { fontSize: '0.75rem', color: '#484f58', marginTop: '0.15rem' },
  solved: { textAlign: 'right', flexShrink: 0 },
  solvedNum: { fontSize: '1.1rem', fontWeight: '700', color: '#58a6ff' },
  solvedLabel: { fontSize: '0.65rem', color: '#484f58' },
  removeBtnSmall: { background: 'transparent', color: '#484f58', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', flexShrink: 0 },

  skeleton: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  skeletonRow: { height: '56px', borderRadius: '8px', background: 'linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.5s infinite' },
  empty: { color: '#484f58', fontSize: '0.875rem', padding: '1.5rem 0', textAlign: 'center' },
};
