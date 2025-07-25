import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          MemoryMap
        </h1>
        <p className="hero-subtitle">
          Every journey tells a story, every memory marks a place on the map of your life. 
          Capture the essence of your adventures, preserve the beauty of everyday moments, 
          and discover the extraordinary in the ordinary.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">
            📖 Begin Your Journey
          </Link>
          <Link to="/login" className="btn btn-secondary">
            🗝️ Return to Map
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Explore Your Inner Landscape</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🗺️</span>
            <h3>Chart Your Course</h3>
            <p>
              Map your emotional journey through time and space. Connect your memories 
              to places and discover patterns in your personal geography of experiences.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📔</span>
            <h3>Document Your Voyage</h3>
            <p>
              Write with the elegance of travel journals. Your thoughts deserve 
              a beautiful home, crafted with modern design and timeless aesthetics.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🧭</span>
            <h3>Navigate Insights</h3>
            <p>
              Let advanced analytics be your compass. Understand the terrain of your 
              emotions and discover hidden pathways to personal growth and understanding.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🎒</span>
            <h3>Pack Light, Remember Deep</h3>
            <p>
              Capture not just events, but the essence of moments. Our tools help you 
              preserve the weight of experiences without the burden of complexity.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🌸</span>
            <h3>Seasonal Reflections</h3>
            <p>
              Like cherry blossoms that bloom and fade, each entry captures a moment 
              in time. Watch your personal seasons unfold through thoughtful documentation.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🎭</span>
            <h3>Emotional Cartography</h3>
            <p>
              Map the landscape of your feelings with sophisticated mood tracking. 
              Create a topographical guide to your inner world's peaks and valleys.
            </p>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="features-section">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="section-title">Your Adventure Awaits</h2>
            <p className="mb-8">
              Every master cartographer started with a single point on the map. 
              Begin charting your unique course through the landscape of memory and meaning.
            </p>
            <Link to="/register" className="btn btn-primary">
              🧳 Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="features-section">
        <h2 className="section-title">What Awaits Your Discovery</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location Memory</h3>
            <p>Pin your thoughts to the places where they were born. Geography meets psychology in beautiful harmony.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Pattern Recognition</h3>
            <p>Uncover the hidden rhythms of your life. See how your moods, locations, and experiences interconnect.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Visual Storytelling</h3>
            <p>Transform your words into beautiful visual narratives. Every entry becomes part of your personal exhibition.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Sacred Privacy</h3>
            <p>Your inner world remains yours alone. Bank-level security protects the most precious cargo: your thoughts.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 