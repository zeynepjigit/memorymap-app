import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">📖</span>
          <span>MemoryMap</span>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/diary/new" 
            className={`nav-link ${isActive('/diary/new') ? 'active' : ''}`}
          >
            New Entry
          </Link>
          <Link 
            to="/map" 
            className={`nav-link ${isActive('/map') ? 'active' : ''}`}
          >
            Map
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            Gallery
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            Profile
          </Link>
          <Link 
            to="/login" 
            className={`nav-link ${isActive('/login') ? 'active' : ''}`}
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 