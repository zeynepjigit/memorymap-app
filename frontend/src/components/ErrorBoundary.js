import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="card" 
          style={{ 
            padding: '40px', 
            textAlign: 'center',
            margin: '20px auto',
            maxWidth: '500px'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😵</div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '12px', 
            color: 'var(--text-primary)' 
          }}>
            Something went wrong
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Refresh Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="btn btn-ghost"
            >
              Try Again
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: '24px', 
              textAlign: 'left',
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '600',
                marginBottom: '8px',
                color: '#dc3545'
              }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                fontSize: '12px',
                color: '#495057',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
