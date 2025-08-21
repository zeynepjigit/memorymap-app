import React, { useState, useEffect } from 'react';
import QuoteCard from './QuoteCard';
import './QuoteHistory.css';

const QuoteHistory = ({ quotes = [], onClose, isVisible = false }) => {
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    setFilteredQuotes(quotes);
  }, [quotes]);

  useEffect(() => {
    let filtered = [...quotes];

    // Filter by emotion
    if (selectedEmotion !== 'all') {
      filtered = filtered.filter(quote => 
        quote.emotion?.toLowerCase() === selectedEmotion.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(quote =>
        quote.quote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort quotes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'author':
          return (a.author || '').localeCompare(b.author || '');
        case 'emotion':
          return (a.emotion || '').localeCompare(b.emotion || '');
        default:
          return 0;
      }
    });

    setFilteredQuotes(filtered);
  }, [quotes, selectedEmotion, searchTerm, sortBy]);

  const getUniqueEmotions = () => {
    const emotions = quotes.map(q => q.emotion).filter(Boolean);
    return ['all', ...new Set(emotions)];
  };

  const handleQuoteDelete = (quoteToDelete) => {
    // This would typically call an API to delete the quote
    // For now, we'll just filter it out locally
    const updatedQuotes = quotes.filter(q => q !== quoteToDelete);
    setFilteredQuotes(updatedQuotes);
  };

  if (!isVisible) return null;

  return (
    <div className="quote-history-overlay">
      <div className="quote-history-modal">
        {/* Header */}
        <div className="quote-history-header">
          <h2 className="quote-history-title">
            <span className="quote-history-icon">💭</span>
            Inspirational Quotes Collection
          </h2>
          <button className="quote-history-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="quote-history-controls">
          <div className="quote-history-filters">
            <div className="filter-group">
              <label htmlFor="emotion-filter">Emotion:</label>
              <select
                id="emotion-filter"
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="filter-select"
              >
                {getUniqueEmotions().map(emotion => (
                  <option key={emotion} value={emotion}>
                    {emotion === 'all' ? 'All Emotions' : emotion}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-filter">Sort by:</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date">Date</option>
                <option value="author">Author</option>
                <option value="emotion">Emotion</option>
              </select>
            </div>
          </div>

          <div className="quote-history-search">
            <input
              type="text"
              placeholder="Search quotes or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="quote-history-stats">
          <div className="stat-item">
            <span className="stat-number">{filteredQuotes.length}</span>
            <span className="stat-label">Quotes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{new Set(filteredQuotes.map(q => q.author)).size}</span>
            <span className="stat-label">Authors</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{new Set(filteredQuotes.map(q => q.emotion)).size}</span>
            <span className="stat-label">Emotions</span>
          </div>
        </div>

        {/* Quotes Grid */}
        <div className="quote-history-content">
          {filteredQuotes.length > 0 ? (
            <div className="quotes-grid">
              {filteredQuotes.map((quote, index) => (
                <div key={index} className="quote-grid-item">
                  <QuoteCard
                    quote={quote.quote}
                    author={quote.author}
                    emotion={quote.emotion}
                    colors={quote.colors}
                    timestamp={quote.timestamp}
                    onClose={() => handleQuoteDelete(quote)}
                    onSave={() => {}} // Already saved
                    isVisible={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="quote-history-empty">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>No quotes found</h3>
              <p>
                {quotes.length === 0 
                  ? "You haven't saved any inspirational quotes yet. Start writing diary entries to receive personalized quotes!"
                  : "Try adjusting your filters or search terms."
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="quote-history-footer">
          <p className="quote-history-tip">
            💡 Tip: Your inspirational quotes are generated based on your diary entries and emotional states. 
            Keep writing to receive more personalized quotes!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteHistory;
