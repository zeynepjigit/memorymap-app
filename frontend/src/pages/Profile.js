import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-01',
    bio: 'Passionate about documenting life\'s beautiful moments and exploring the world one memory at a time.'
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({...profile});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to save profile
    setProfile({...formData});
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({...profile});
    setEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-email">{profile.email}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>
          Member since {new Date(profile.joinDate).toLocaleDateString()}
        </p>
      </div>
      
      {/* Profile Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Profile Information</h2>
          {!editing && (
            <button className="btn btn-outline" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
        <div className="card-body">
          {editing ? (
            <form>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="form-group">
                <label>Full Name</label>
                <p style={{ margin: 0, color: 'var(--text-primary)' }}>{profile.name}</p>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <p style={{ margin: 0, color: 'var(--text-primary)' }}>{profile.email}</p>
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.6 }}>{profile.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Statistics */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Journey Statistics</h2>
        </div>
        <div className="card-body">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-number">24</div>
              <div className="stat-label">Journal Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">7</div>
              <div className="stat-label">Countries Visited</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">156</div>
              <div className="stat-label">Memories Captured</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Settings</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              🔒 Change Password
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              🔔 Notification Settings
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              🌐 Privacy Settings
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              📱 Export Data
            </button>
            <hr style={{ margin: 'var(--space-4) 0', border: 'none', borderTop: '1px solid var(--gray-200)' }} />
            <button className="btn" style={{ 
              backgroundColor: 'var(--error)', 
              color: 'white', 
              justifyContent: 'flex-start' 
            }}>
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 