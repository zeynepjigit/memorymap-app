import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  color = 'var(--color-primary)',
  fullScreen = false 
}) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: `3px solid rgba(${color === 'var(--color-primary)' ? '102, 126, 234' : '128, 128, 128'}, 0.3)`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  return (
    <div style={containerStyle}>
      <div
        style={spinnerStyle}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p
          style={{
            marginTop: '16px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '500'
          }}
          aria-live="polite"
        >
          {text}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
