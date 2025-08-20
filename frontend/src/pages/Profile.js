import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-01',
    bio: "Passionate about documenting life's beautiful moments and exploring the world one memory at a time."
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSave = () => { setProfile({ ...formData }); setEditing(false); };

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
            <div className="heading" style={{ marginBottom: 4 }}>{profile.name}</div>
            <div className="muted">{profile.email}</div>
            <div className="muted" style={{ marginTop: 6 }}>Üyelik tarihi: {new Date(profile.joinDate).toLocaleDateString()}</div>
          </div>

          <div className="card card-elevated" style={{ marginTop: 16 }}>
            <div className="heading" style={{ marginBottom: 12 }}>Profil Bilgileri</div>
            {!editing ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <div><div className="muted">Ad Soyad</div><strong>{profile.name}</strong></div>
                <div><div className="muted">Email</div><strong>{profile.email}</strong></div>
                <div><div className="muted">Bio</div><div>{profile.bio}</div></div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="button-primary" onClick={() => setEditing(true)}>Düzenle</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                <input className="input-field" name="name" value={formData.name} onChange={handleChange} />
                <input className="input-field" name="email" value={formData.email} onChange={handleChange} />
                <textarea className="input-field" style={{ borderRadius: 16, minHeight: 100 }} name="bio" value={formData.bio} onChange={handleChange} />
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