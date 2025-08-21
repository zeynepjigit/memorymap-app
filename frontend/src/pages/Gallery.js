import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserImages, getDiaryEntries, queryDiaryEntries } from '../services/api';
import AnalysisCard from '../components/AnalysisCard';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('entries'); // entries | images
  const [search, setSearch] = useState('');
  const [semanticResults, setSemanticResults] = useState([]);
  const [sentiment, setSentiment] = useState('all'); // all|positive|negative|neutral
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [imgRes, entryRes] = await Promise.all([
        getUserImages(),
        getDiaryEntries(30),
      ]);
      if (imgRes.success && imgRes.data.images) setImages(imgRes.data.images);
      if (entryRes.success && entryRes.data.entries) setEntries(entryRes.data.entries);
      setError(null);
    } catch (e) {
      setError('Veriler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEntryDeleted = (deletedId) => {
    // Remove from entries immediately
    setEntries(prev => prev.filter(entry => entry.id !== deletedId));
  };

  const filteredEntries = entries.filter((e) => {
    if (sentiment !== 'all') {
      const label = e?.analysis?.affect?.primary_emotions?.[0]?.label || e?.mood || '';
      if (typeof label === 'string' && !label.toLowerCase().includes(sentiment.toLowerCase())) return false;
    }
    if (search.trim().length > 0) {
      const t = (e.title || '') + ' ' + (e.content || '') + ' ' + (e.analysis?.summary || '');
      return t.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const runSemanticSearch = async () => {
    if (search.trim().length < 3) { setSemanticResults([]); return; }
    const res = await queryDiaryEntries(search, 6);
    if (res.success && Array.isArray(res.results)) setSemanticResults(res.results);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/gallery" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Gallery</Link></li>
            <li><Link to="/emotional-map" className="nav-link">Emotional Map</Link></li>
            <li><Link to="/memories" className="nav-link">Memories</Link></li>
            <li><Link to="/quotes" className="nav-link">Quotes</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <h1 className="section-title">Explore Memories</h1>
          <p className="section-subtitle">Browse entries, filter by sentiment, or run semantic search. Switch to Images tab to view artwork.</p>
        </div>

        <div className="tabs-header" style={{ marginBottom: 16 }}>
          <button className={`tab-button ${activeTab==='entries'?'active':''}`} onClick={() => setActiveTab('entries')}>Entries</button>
          <button className={`tab-button ${activeTab==='images'?'active':''}`} onClick={() => setActiveTab('images')}>Images</button>
        </div>

        {activeTab === 'entries' && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 180px 140px' }}>
              <input className="form-input" placeholder="Search text or themes..." value={search} onChange={(e)=>setSearch(e.target.value)} />
              <button className="btn btn-secondary" onClick={runSemanticSearch} disabled={search.trim().length<3}>Semantic Search</button>
              <select className="form-input" value={sentiment} onChange={(e)=>setSentiment(e.target.value)}>
                <option value="all">All sentiments</option>
                <option value="positive">positive</option>
                <option value="neutral">neutral</option>
                <option value="negative">negative</option>
              </select>
            </div>
          </div>
        )}

        <div style={{ padding: 16 }}>
          {activeTab === 'entries' ? (
            loading ? (
              <div className="card">Loading...</div>
            ) : (
              <>
                {semanticResults.length > 0 && (
                  <div className="card" style={{ marginBottom: 16 }}>
                    <h4 style={{ marginBottom: 8 }}>Semantic results</h4>
                    <div className="dashboard-grid">
                      {semanticResults.map((r, idx) => (
                        <div key={idx} className="dashboard-card">
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{r.metadata?.date} • {r.metadata?.emotion}</div>
                          <div style={{ fontSize: 14 }}>{(r.content || '').slice(0, 200)}...</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="dashboard-grid">
                  {filteredEntries.map((e) => (
                    <AnalysisCard key={e.id} entry={e} onDelete={handleEntryDeleted} />
                  ))}
                </div>
              </>
            )
          ) : (
            loading ? (
              <div className="card">Loading...</div>
            ) : error ? (
              <div className="card" style={{ color: 'crimson' }}>{error}</div>
            ) : images.length === 0 ? (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36 }}>📸</div>
                No images yet
              </div>
            ) : (
              <div className="grid-3">
                {images.map((img, i) => (
                  <div key={i} className="card card-elevated">
                    <img src={img.url} alt={img.filename} style={{ width: '100%', borderRadius: 12, marginBottom: 8 }} />
                    <div style={{ fontWeight: 700 }}>{img.filename}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery; 