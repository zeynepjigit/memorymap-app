import React from 'react';

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

const AnalysisCard = ({ entry }) => {
  const a = entry.analysis || {};
  const affect = a.affect || {};
  const emotions = Array.isArray(affect.primary_emotions) ? affect.primary_emotions.slice(0, 2) : [];
  const themes = Array.isArray(a.themes) ? a.themes.slice(0, 4) : [];
  const lifeDomains = Array.isArray(a.life_domains) ? a.life_domains.slice(0, 2) : [];
  const quote = a.quote || null;
  const media = entry.media || {};

  return (
    <div className="dashboard-card" style={{ display: 'grid', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 className="dashboard-card-title" style={{ margin: 0 }}>{entry.title || 'Untitled Entry'}</h4>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {new Date(entry.created_at?.seconds ? entry.created_at.seconds * 1000 : entry.created_at || Date.now()).toLocaleDateString()}
          </div>
        </div>
        {emotions.length > 0 && (
          <div>
            {emotions.map((e, i) => (
              <Chip key={i}>{`${e.label}${typeof e.intensity === 'number' ? ` ${Math.round(e.intensity*100)}%` : ''}`}</Chip>
            ))}
          </div>
        )}
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


