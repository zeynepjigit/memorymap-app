import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDiaryEntries, deleteDiaryEntry, queryDiaryEntries } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Memories = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Color tags for categorization
  const colorTags = [
    { id: 'all', name: 'All Memories', color: '#808080' },
    { id: 'happy', name: 'Happy', color: '#FFD700' },
    { id: 'peaceful', name: 'Peaceful', color: '#98FB98' },
    { id: 'excited', name: 'Excited', color: '#FF6B6B' },
    { id: 'reflective', name: 'Reflective', color: '#87CEEB' },
    { id: 'grateful', name: 'Grateful', color: '#32CD32' },
    { id: 'creative', name: 'Creative', color: '#9370DB' },
    { id: 'challenging', name: 'Challenging', color: '#DC143C' }
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterAndSortEntries();
  }, [entries, searchTerm, selectedTag, sortBy]);

  // Debug effect for selectedTag changes
  useEffect(() => {
    console.log('Selected tag changed to:', selectedTag);
  }, [selectedTag]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const result = await getDiaryEntries(100);
      if (result.success) {
        const entriesWithTags = result.data.entries.map(entry => ({
          ...entry,
          colorTag: getEmotionTag(entry)
        }));
        console.log('Loaded entries with tags:', entriesWithTags);
        setEntries(entriesWithTags);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
    setLoading(false);
  };

  const getEmotionTag = (entry) => {
    // Debug: Log the entry structure
    console.log('Analyzing entry for emotion tag:', entry);
    
    // Try multiple sources for emotion data
    let emotion = '';
    
    // Check analysis.affect.primary_emotions first
    if (entry?.analysis?.affect?.primary_emotions && Array.isArray(entry.analysis.affect.primary_emotions)) {
      emotion = entry.analysis.affect.primary_emotions[0]?.label || '';
    }
    
    // Fallback to mood field
    if (!emotion && entry?.mood) {
      emotion = entry.mood;
    }
    
    // Fallback to analysis.emotion (legacy)
    if (!emotion && entry?.analysis?.emotion) {
      emotion = entry.analysis.emotion;
    }
    
    console.log('Detected emotion:', emotion);
    
    const emotionLower = emotion.toLowerCase();
    
    if (emotionLower.includes('happy') || emotionLower.includes('joy') || emotionLower.includes('positive')) return 'happy';
    if (emotionLower.includes('calm') || emotionLower.includes('peaceful') || emotionLower.includes('relaxed')) return 'peaceful';
    if (emotionLower.includes('excited') || emotionLower.includes('energetic') || emotionLower.includes('enthusiastic')) return 'excited';
    if (emotionLower.includes('grateful') || emotionLower.includes('thankful') || emotionLower.includes('appreciative')) return 'grateful';
    if (emotionLower.includes('creative') || emotionLower.includes('inspired') || emotionLower.includes('imaginative')) return 'creative';
    if (emotionLower.includes('sad') || emotionLower.includes('difficult') || emotionLower.includes('challenging') || emotionLower.includes('negative')) return 'challenging';
    if (emotionLower.includes('reflective') || emotionLower.includes('thoughtful') || emotionLower.includes('contemplative')) return 'reflective';
    
    // Default to reflective if no emotion detected
    return 'reflective';
  };

  const filterAndSortEntries = () => {
    console.log('Filtering entries with:', { searchTerm, selectedTag, sortBy, totalEntries: entries.length });
    
    let filtered = [...entries];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(entry =>
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by color tag
    if (selectedTag !== 'all') {
      console.log('Filtering by tag:', selectedTag);
      filtered = filtered.filter(entry => {
        console.log('Entry colorTag:', entry.colorTag, 'Selected tag:', selectedTag, 'Match:', entry.colorTag === selectedTag);
        return entry.colorTag === selectedTag;
      });
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    console.log('Filtered results:', filtered.length, 'entries');
    setFilteredEntries(filtered);
  };

  const handleEntrySelect = (entryId) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedEntries(newSelected);
  };

  const handleBulkDelete = async () => {
    try {
      for (const entryId of selectedEntries) {
        await deleteDiaryEntry(entryId);
      }
      await loadEntries();
      setSelectedEntries(new Set());
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete entries:', error);
      alert('Failed to delete some entries. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTagColor = (tagId) => {
    const tag = colorTags.find(t => t.id === tagId);
    return tag?.color || '#808080';
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
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/emotional-map" className="nav-link">Emotional Map</Link></li>
            <li><Link to="/memories" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Memories</Link></li>
            <li><Link to="/quotes" className="nav-link">Quotes</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">
            Your <span className="hero-title-gradient">Memory Collection</span>
          </h1>
          <p className="section-subtitle">
            Organize, search, and explore your personal memories with powerful filtering and tagging capabilities.
          </p>
        </div>

        {/* Controls Section */}
        <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search memories by title, content, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <svg
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--text-muted)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="21 21l-4.35-4.35"/>
              </svg>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: '150px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>

            {/* Create New Button */}
            <Link to="/diary-entry" className="btn btn-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Memory
            </Link>
          </div>

          {/* Color Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {colorTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  console.log('Tag clicked:', tag.id, tag.name);
                  setSelectedTag(tag.id);
                }}
                className={`btn ${selectedTag === tag.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  fontSize: '14px',
                  padding: '6px 12px',
                  borderColor: selectedTag === tag.id ? tag.color : 'transparent',
                  backgroundColor: selectedTag === tag.id ? tag.color + '20' : 'transparent',
                  transform: selectedTag === tag.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTag === tag.id ? `0 2px 8px ${tag.color}40` : 'none'
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: tag.color,
                    marginRight: '6px',
                    display: 'inline-block'
                  }}
                />
                {tag.name}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedEntries.size > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dark)', fontWeight: '500' }}>
                {selectedEntries.size} memories selected
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedEntries(new Set())}
                  className="btn btn-ghost"
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '14px', padding: '6px 12px', color: 'var(--accent-red)' }}
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Memories Grid */}
        {loading ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div className="loading">
              <div className="spinner"></div>
              <span>Loading your memories...</span>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>
              {searchTerm || selectedTag !== 'all' ? 'No memories found' : 'No memories yet'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {searchTerm || selectedTag !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start creating diary entries to build your memory collection.'
              }
            </p>
            {(!searchTerm && selectedTag === 'all') && (
              <Link to="/diary-entry" className="btn btn-primary">
                Create Your First Memory
              </Link>
            )}
          </div>
        ) : (
          <div className="dashboard-grid">
            <AnimatePresence>
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="dashboard-card"
                  style={{
                    cursor: 'pointer',
                    border: selectedEntries.has(entry.id) ? `2px solid ${getTagColor(entry.colorTag)}` : '1px solid var(--border-light)',
                    transform: selectedEntries.has(entry.id) ? 'scale(0.98)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleEntrySelect(entry.id)}
                >
                  {/* Selection Checkbox */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedEntries.has(entry.id)}
                      onChange={() => handleEntrySelect(entry.id)}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </div>

                  {/* Color Tag Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '4px',
                      height: '100%',
                      backgroundColor: getTagColor(entry.colorTag),
                      borderRadius: '4px 0 0 4px'
                    }}
                  />

                  <div style={{ marginBottom: '12px', paddingLeft: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {formatDate(entry.created_at)}
                      {entry.location && (
                        <span style={{ marginLeft: '8px' }}>
                          📍 {entry.location}
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                      {entry.title || 'Untitled Memory'}
                    </h4>
                  </div>

                  <div style={{ paddingLeft: '12px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                      {entry.content ? entry.content.slice(0, 150) + (entry.content.length > 150 ? '...' : '') : 'No content available'}
                    </p>

                    {/* Tags and Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            padding: '2px 8px',
                            backgroundColor: getTagColor(entry.colorTag) + '20',
                            color: getTagColor(entry.colorTag),
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}
                        >
                          {colorTags.find(t => t.id === entry.colorTag)?.name || 'Reflective'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/diary-entry/${entry.id}`);
                          }}
                          className="btn btn-ghost"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredEntries.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)' }}>
            Showing {filteredEntries.length} of {entries.length} memories
            {selectedTag !== 'all' && (
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                Filtered by: <strong>{colorTags.find(t => t.id === selectedTag)?.name}</strong>
              </div>
            )}
          </div>
        )}
        
        {/* Debug Info (remove in production) */}
        {!loading && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '8px', fontSize: '12px' }}>
            <strong>Debug Info:</strong><br/>
            Selected Tag: {selectedTag}<br/>
            Total Entries: {entries.length}<br/>
            Filtered Entries: {filteredEntries.length}<br/>
            Search Term: "{searchTerm}"<br/>
            Tag Distribution: {colorTags.map(tag => 
              `${tag.name}: ${entries.filter(e => e.colorTag === tag.id).length}`
            ).join(', ')}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="quote-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="card" style={{ maxWidth: '400px', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: '16px', color: 'var(--text-dark)' }}>Confirm Deletion</h3>
              <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                Are you sure you want to delete {selectedEntries.size} selected memories? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-secondary"
                  style={{ color: 'var(--accent-red)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memories;
