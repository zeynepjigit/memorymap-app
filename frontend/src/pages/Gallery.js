import React from 'react';

const Gallery = () => {
  // Sample gallery data - in a real app, this would come from an API
  const galleryItems = [
    {
      id: 1,
      title: "Sunset in Santorini",
      location: "Santorini, Greece",
      date: "2024-01-15",
      description: "The golden hour painted the white buildings in warm hues as the sun dipped into the Aegean Sea."
    },
    {
      id: 2,
      title: "Cherry Blossoms in Tokyo",
      location: "Tokyo, Japan",
      date: "2024-01-12",
      description: "Spring brought a magical transformation to the bustling streets with delicate pink petals dancing in the breeze."
    },
    {
      id: 3,
      title: "Coffee Culture in Vienna",
      location: "Vienna, Austria",
      date: "2024-01-10",
      description: "The timeless atmosphere of traditional Viennese coffeehouses where history and modernity meet."
    },
    {
      id: 4,
      title: "Northern Lights in Iceland",
      location: "Reykjavik, Iceland",
      date: "2024-01-08",
      description: "Nature's own light show painted the Arctic sky in brilliant greens and blues."
    },
    {
      id: 5,
      title: "Tuscany Vineyards",
      location: "Tuscany, Italy",
      date: "2024-01-05",
      description: "Rolling hills covered with vineyards stretched as far as the eye could see in the golden Italian countryside."
    },
    {
      id: 6,
      title: "Moroccan Bazaar",
      location: "Marrakech, Morocco",
      date: "2024-01-03",
      description: "A sensory overload of colors, spices, and sounds in the vibrant souks of the medina."
    }
  ];

  return (
    <div className="gallery-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Memory Gallery</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Browse through your collection of travel memories
        </p>
      </div>

      {galleryItems.length > 0 ? (
        <div className="gallery-grid">
          {galleryItems.map(item => (
            <div key={item.id} className="gallery-item">
              <div className="gallery-image">
                📸
              </div>
              <div className="gallery-content">
                <div className="entry-date">{new Date(item.date).toLocaleDateString()}</div>
                <h3 className="gallery-title">{item.title}</h3>
                <div className="badge badge-secondary mb-4">{item.location}</div>
                <p className="gallery-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📸</div>
          <h3>No Memories Yet</h3>
          <p>Start creating journal entries to build your memory gallery.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery; 