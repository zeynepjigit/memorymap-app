import React, { useState } from 'react';

const MapView = () => {
  // Sample location data - in a real app, this would come from an API
  const [memories] = useState([
    {
      id: 1,
      title: 'Sunset in Santorini',
      location: 'Santorini, Greece',
      date: '2024-01-15',
      coordinates: { lat: 36.3932, lng: 25.4615 },
      emotion: 'joy'
    },
    {
      id: 2,
      title: 'Cherry Blossoms in Tokyo',
      location: 'Tokyo, Japan',
      date: '2024-01-12',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      emotion: 'wonder'
    },
    {
      id: 3,
      title: 'Coffee Culture in Vienna',
      location: 'Vienna, Austria',
      date: '2024-01-10',
      coordinates: { lat: 48.2082, lng: 16.3738 },
      emotion: 'contentment'
    },
    {
      id: 4,
      title: 'Northern Lights in Iceland',
      location: 'Reykjavik, Iceland',
      date: '2024-01-08',
      coordinates: { lat: 64.1466, lng: -21.9426 },
      emotion: 'awe'
    }
  ]);

  const [selectedMemory, setSelectedMemory] = useState(null);

  return (
    <div className="map-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Travel Map</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Explore your memories around the world
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="map-wrapper">
        🗺️ Interactive Map Coming Soon
        <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-4)', color: 'var(--text-secondary)' }}>
          Your travel memories will be displayed on an interactive world map
        </p>
      </div>

      {/* Memory Locations List */}
      <div className="recent-entries">
        <div className="recent-entries-header">
          <h2 className="recent-entries-title">Memory Locations</h2>
          <span className="badge badge-primary">{memories.length} places</span>
        </div>
        
        <div>
          {memories.map(memory => (
            <div 
              key={memory.id} 
              className="entry-item"
              onClick={() => setSelectedMemory(memory)}
              style={{ cursor: 'pointer' }}
            >
              <div className="entry-date">{new Date(memory.date).toLocaleDateString()}</div>
              <h3 className="entry-title">{memory.title}</h3>
              <div className="entry-preview">
                <strong>📍 {memory.location}</strong>
                <br />
                <small style={{ color: 'var(--text-secondary)' }}>
                  Coordinates: {memory.coordinates.lat.toFixed(4)}, {memory.coordinates.lng.toFixed(4)}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Memory Details */}
      {selectedMemory && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Selected Memory</h3>
          </div>
          <div className="card-body">
            <h4>{selectedMemory.title}</h4>
            <p><strong>Location:</strong> {selectedMemory.location}</p>
            <p><strong>Date:</strong> {new Date(selectedMemory.date).toLocaleDateString()}</p>
            <p><strong>Coordinates:</strong> {selectedMemory.coordinates.lat}, {selectedMemory.coordinates.lng}</p>
            <p><strong>Emotion:</strong> <span className="badge badge-secondary">{selectedMemory.emotion}</span></p>
            <button 
              className="btn btn-outline" 
              onClick={() => setSelectedMemory(null)}
              style={{ marginTop: 'var(--space-4)' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {memories.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <h3>No Locations Yet</h3>
          <p>Start writing journal entries with locations to see them on your travel map.</p>
        </div>
      )}
    </div>
  );
};

export default MapView; 