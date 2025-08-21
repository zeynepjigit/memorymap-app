import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '📝',
  title = 'Nothing here yet',
  description = 'Get started by creating your first item.',
  actionText = 'Get Started',
  actionLink = null,
  onAction = null,
  size = 'medium'
}) => {
  const sizeStyles = {
    small: {
      padding: '32px',
      iconSize: '32px',
      titleSize: '18px',
      descSize: '14px'
    },
    medium: {
      padding: '48px',
      iconSize: '48px',
      titleSize: '24px',
      descSize: '16px'
    },
    large: {
      padding: '64px',
      iconSize: '64px',
      titleSize: '32px',
      descSize: '18px'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  const renderAction = () => {
    if (!actionText) return null;

    const buttonProps = {
      className: 'btn btn-primary',
      style: { marginTop: '24px' }
    };

    if (actionLink) {
      return (
        <Link to={actionLink} {...buttonProps}>
          {actionText}
        </Link>
      );
    }

    if (onAction) {
      return (
        <button onClick={onAction} {...buttonProps}>
          {actionText}
        </button>
      );
    }

    return null;
  };

  return (
    <div 
      className="card" 
      style={{ 
        padding: currentSize.padding, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}
      role="region"
      aria-label="Empty state"
    >
      <div 
        style={{ 
          fontSize: currentSize.iconSize, 
          marginBottom: '16px',
          opacity: 0.8
        }}
        role="img"
        aria-label="Empty state icon"
      >
        {icon}
      </div>
      
      <h3 style={{ 
        fontSize: currentSize.titleSize,
        fontWeight: '700', 
        marginBottom: '12px', 
        color: 'var(--text-primary)' 
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: currentSize.descSize,
        lineHeight: '1.6',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {description}
      </p>
      
      {renderAction()}
    </div>
  );
};

export default EmptyState;
