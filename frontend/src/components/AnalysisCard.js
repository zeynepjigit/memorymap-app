import React, { useState } from 'react';
import { deleteDiaryEntry } from '../services/api';

const Chip = ({ children }) => (
  <span style={{
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '999px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-light)',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginRight: '6px',
    marginBottom: '6px',
  }}>{children}</span>
);

const AnalysisCard = ({ entry, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const a = entry.analysis || {};
  const affect = a.affect || {};
  const emotions = Array.isArray(affect.primary_emotions) ? affect.primary_emotions.slice(0, 2) : [];
  const themes = Array.isArray(a.themes) ? a.themes.slice(0, 4) : [];
  const lifeDomains = Array.isArray(a.life_domains) ? a.life_domains.slice(0, 2) : [];
  const quote = a.quote || null;
  const media = entry.media || {};

  const handleDelete = async () => {
    if (!window.confirm('Bu günlük girişini silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteDiaryEntry(entry.id);
      if (result.success) {
        if (onDelete) {
          onDelete(entry.id);
        } else {
          // Fallback: Sayfayı yenile
          window.location.reload();
        }
      } else {
        alert('Silme işlemi başarısız: ' + (result.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme işlemi başarısız: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-card" style={{ display: 'grid', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 className="dashboard-card-title" style={{ margin: 0 }}>{entry.title || 'Untitled Entry'}</h4>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {new Date(entry.created_at?.seconds ? entry.created_at.seconds * 1000 : entry.created_at || Date.now()).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {emotions.length > 0 && (
            <div>
              {emotions.map((e, i) => (
                <Chip key={i}>{`${e.label}${typeof e.intensity === 'number' ? ` ${Math.round(e.intensity*100)}%` : ''}`}</Chip>
              ))}
            </div>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isDeleting ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
            title="Günlük girişini sil"
          >
            {isDeleting ? (
              <div style={{ width: '16px', height: '16px', border: '2px solid #ef4444', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {media.image_url ? (
        <img src={media.image_url} alt="entry" style={{ width: '100%', borderRadius: '12px' }} />
      ) : null}

      <div style={{ color: 'var(--text-dark)', fontSize: '14px', lineHeight: 1.6 }}>
        {a.summary || (entry.content ? `${entry.content.slice(0, 160)}...` : 'No summary available.')}
      </div>

      {(themes.length > 0 || lifeDomains.length > 0) && (
        <div>
          {themes.map((t, i) => <Chip key={`t-${i}`}>{t}</Chip>)}
          {lifeDomains.map((d, i) => <Chip key={`d-${i}`}>{d}</Chip>)}
        </div>
      )}

      {quote && quote.text && (
        <blockquote style={{
          margin: 0,
          padding: '12px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          fontStyle: 'italic',
          color: 'var(--text-primary)'
        }}>
          “{quote.text}”
          {quote.author && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>— {quote.author}</div>
          )}
        </blockquote>
      )}
    </div>
  );
};

export default AnalysisCard;


