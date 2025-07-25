import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Sample data - in a real app, this would come from an API
  const stats = {
    totalEntries: 24,
    countriesVisited: 7,
    citiesExplored: 15,
    memoriesCreated: 156
  };

  const recentEntries = [
    {
      id: 1,
      title: "Sunset in Santorini",
      date: "2024-01-15",
      location: "Santorini, Greece",
      preview: "The golden hour painted the white buildings in warm hues as I sat on the terrace watching the sun dip into the Aegean Sea..."
    },
    {
      id: 2,
      title: "Unexpected Rain in Tokyo",
      date: "2024-01-12",
      location: "Tokyo, Japan",
      preview: "The sudden downpour transformed the bustling streets into a symphony of umbrellas and neon reflections..."
    },
    {
      id: 3,
      title: "Coffee Culture in Vienna",
      date: "2024-01-10",
      location: "Vienna, Austria",
      preview: "Sitting in Café Central, I couldn't help but imagine the conversations that have echoed through these walls for centuries..."
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Travel Dashboard</h1>
        <Link to="/diary/new" className="btn btn-primary">
          ✍️ New Entry
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalEntries}</div>
          <div className="stat-label">Journal Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.countriesVisited}</div>
          <div className="stat-label">Countries Visited</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.citiesExplored}</div>
          <div className="stat-label">Cities Explored</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.memoriesCreated}</div>
          <div className="stat-label">Memories Created</div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="recent-entries">
        <div className="recent-entries-header">
          <h2 className="recent-entries-title">Recent Journal Entries</h2>
          <Link to="/gallery" className="btn btn-outline">
            View All
          </Link>
        </div>
        
        <div>
          {recentEntries.length > 0 ? (
            recentEntries.map(entry => (
              <div key={entry.id} className="entry-item">
                <div className="entry-date">{new Date(entry.date).toLocaleDateString()}</div>
                <h3 className="entry-title">{entry.title}</h3>
                <div className="entry-preview">
                  <strong>{entry.location}</strong> - {entry.preview}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>Start Your Journey</h3>
              <p>You haven't written any entries yet. Create your first memory to get started!</p>
              <Link to="/diary/new" className="btn btn-primary">
                Write Your First Entry
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-stats">
        <Link to="/map" className="feature-card">
          <span className="feature-icon">🗺️</span>
          <h3>View Map</h3>
          <p>Explore your travels on an interactive map</p>
        </Link>
        
        <Link to="/gallery" className="feature-card">
          <span className="feature-icon">📸</span>
          <h3>Memory Gallery</h3>
          <p>Browse through your collection of memories</p>
        </Link>
        
        <Link to="/profile" className="feature-card">
          <span className="feature-icon">👤</span>
          <h3>Profile</h3>
          <p>Manage your account and preferences</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;