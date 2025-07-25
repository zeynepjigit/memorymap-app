import React from 'react';

// Modern Card Component
export const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'gradient':
        return 'card-gradient';
      case 'dark':
        return 'card-dark';
      default:
        return '';
    }
  };

  return (
    <div className={`card ${getVariantClass()} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Modern Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  return (
    <button 
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// Modern Input Component
export const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input 
        className={`${error ? 'error' : ''} ${className}`} 
        {...props} 
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

// Modern Textarea Component
export const Textarea = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <textarea 
        className={`${error ? 'error' : ''} ${className}`} 
        {...props} 
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'spinner-sm';
      case 'lg':
        return 'spinner-lg';
      default:
        return 'spinner-md';
    }
  };

  return (
    <div className={`loading-spinner ${getSizeClass()} ${className}`}>
      <div className="spinner-circle"></div>
    </div>
  );
};

// Status Badge Component
export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'positive':
        return 'emotion-positive';
      case 'negative':
        return 'emotion-negative';
      case 'neutral':
        return 'emotion-neutral';
      default:
        return 'badge-default';
    }
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`}>
      {children}
    </span>
  );
};

// Hero Section Component
export const HeroSection = ({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}) => {
  return (
    <section className={`hero-section ${className}`}>
      {title && <h1 className="hero-title">{title}</h1>}
      {subtitle && <p className="hero-subtitle">{subtitle}</p>}
      {children}
    </section>
  );
};

// Feature Card Component
export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  className = '' 
}) => {
  return (
    <div className={`feature-card ${className}`}>
      {icon && <span className="feature-icon">{icon}</span>}
      {title && <h3 className="feature-title">{title}</h3>}
      {description && <p className="feature-description">{description}</p>}
    </div>
  );
};

// Glass Container Component
export const GlassContainer = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`glass backdrop-blur ${className}`}>
      {children}
    </div>
  );
};

// Gradient Text Component
export const GradientText = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`text-gradient ${className}`}>
      {children}
    </span>
  );
};

// Dashboard Stat Component
export const DashboardStat = ({ 
  number, 
  label, 
  className = '' 
}) => {
  return (
    <div className={`dashboard-stat ${className}`}>
      <div className="dashboard-stat-number">{number}</div>
      <div className="dashboard-stat-label">{label}</div>
    </div>
  );
}; 