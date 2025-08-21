import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    created_at: '',
    bio: ''
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await getMyProfile();
      if (res.success) {
        setProfile(res.data);
        setFormData(res.data);
      } else {
        setError(res.error || 'Failed to load profile');
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSave = async () => {
    setError('');
    const update = {
      full_name: formData.full_name,
      username: formData.username,
      email: formData.email,
      bio: formData.bio,
      location: formData.location,
    };
    const res = await updateMyProfile(update);
    if (res.success) {
      setProfile(res.data);
      setFormData(res.data);
      setEditing(false);
    } else {
      setError(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/profile" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Your Profile</h1>
          <p className="section-subtitle">
            Manage your MemoryMap account settings and preferences
          </p>
        </div>

        <div style={{ padding: 16 }}>
          <div className="card card-elevated" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 6 }}>😀</div>
            <div className="heading" style={{ marginBottom: 4 }}>{profile.full_name || profile.username || 'User'}</div>
            <div className="muted">{profile.email}</div>
            {profile.created_at && (
              <div className="muted" style={{ marginTop: 6 }}>Joined: {new Date(profile.created_at).toLocaleDateString()}</div>
            )}
          </div>

          <div className="card card-elevated" style={{ marginTop: 16 }}>
            <div className="heading" style={{ marginBottom: 12 }}>Profil Bilgileri</div>
            {error && (
              <div className="error-message" style={{ marginBottom: 12 }}>{error}</div>
            )}
            {loading ? (
              <div className="loading"><div className="spinner"></div><span>Loading...</span></div>
            ) : !editing ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <div><div className="muted">Full Name</div><strong>{profile.full_name}</strong></div>
                <div><div className="muted">Email</div><strong>{profile.email}</strong></div>
                <div><div className="muted">Bio</div><div>{profile.bio}</div></div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="button-primary" onClick={() => setEditing(true)}>Düzenle</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                <input className="input-field" name="full_name" value={formData.full_name || ''} onChange={handleChange} placeholder="Full name"/>
                <input className="input-field" name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username"/>
                <input className="input-field" name="email" value={formData.email} onChange={handleChange} />
                <textarea className="input-field" style={{ borderRadius: 16, minHeight: 100 }} name="bio" value={formData.bio || ''} onChange={handleChange} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="button-ghost" onClick={() => { setFormData(profile); setEditing(false); }}>İptal</button>
                  <button className="button-primary" onClick={handleSave}>Kaydet</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 