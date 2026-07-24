import React, { useState } from 'react';
import { X, User, Settings, ShieldCheck, Download, Volume2, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { PROFILES_DATA } from '../data/moviesData';

export default function ProfileModal({ onClose, activeProfile, setActiveProfile }) {
  const [quality, setQuality] = useState('4K Ultra HD');
  const [audioLang, setAudioLang] = useState('English (Original 5.1)');
  const [subtitles, setSubtitles] = useState('English [CC]');
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="profile-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <User className="accent-icon" size={24} />
            <h2>User Account & Playback Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="profile-modal-body">
          {/* Profile Switcher Section */}
          <div className="settings-section">
            <h3 className="settings-subtitle">Switch Profile</h3>
            <div className="profiles-grid">
              {PROFILES_DATA.map((prof) => {
                const isSelected = activeProfile.id === prof.id;
                return (
                  <div
                    key={prof.id}
                    className={`profile-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActiveProfile(prof)}
                  >
                    <div className="avatar-circle" style={{ background: prof.avatarBg }}>
                      {prof.name.charAt(0)}
                    </div>
                    <span className="profile-name">{prof.name}</span>
                    <span className="profile-badge">{prof.badge}</span>
                    {isSelected && <CheckCircle2 className="selected-icon" size={18} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video & Audio Preferences */}
          <div className="settings-section">
            <h3 className="settings-subtitle">Streaming Preferences</h3>

            <div className="setting-row">
              <div className="setting-label">
                <Sparkles size={18} color="var(--accent-cyan)" />
                <div>
                  <strong>Default Playback Quality</strong>
                  <p>Choose preferred stream resolution limit</p>
                </div>
              </div>
              <select 
                className="custom-select" 
                value={quality} 
                onChange={(e) => setQuality(e.target.value)}
              >
                <option value="4K Ultra HD">4K Ultra HD + HDR</option>
                <option value="1080p Full HD">1080p Full HD</option>
                <option value="720p HD">720p HD (Data Saver)</option>
                <option value="Auto">Auto (Adaptive)</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <Volume2 size={18} color="var(--accent-purple)" />
                <div>
                  <strong>Default Audio Language</strong>
                  <p>Preferred default soundtrack</p>
                </div>
              </div>
              <select 
                className="custom-select" 
                value={audioLang} 
                onChange={(e) => setAudioLang(e.target.value)}
              >
                <option value="English (Original 5.1)">English (Original 5.1)</option>
                <option value="Spanish (Dolby Atmos)">Spanish (Dolby Atmos)</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-label">
                <ShieldCheck size={18} color="#10b981" />
                <div>
                  <strong>Subtitles</strong>
                  <p>Default closed captioning state</p>
                </div>
              </div>
              <select 
                className="custom-select" 
                value={subtitles} 
                onChange={(e) => setSubtitles(e.target.value)}
              >
                <option value="English [CC]">English [CC]</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Spanish">Spanish</option>
                <option value="Off">Off</option>
              </select>
            </div>
          </div>

          {/* Download & Storage Stats */}
          <div className="settings-section">
            <h3 className="settings-subtitle">Offline & Devices</h3>
            <div className="storage-card">
              <div className="storage-info">
                <Download size={20} color="var(--accent-purple)" />
                <div>
                  <strong>Downloaded Media Storage</strong>
                  <p>12.4 GB used of 50 GB allocated storage</p>
                </div>
              </div>
              <div className="progress-bar-bg" style={{ marginTop: '10px' }}>
                <div className="progress-bar-fill" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {savedToast ? (
            <div className="save-toast-msg">
              <Check size={18} /> Settings saved successfully!
            </div>
          ) : (
            <button className="primary-action-btn" onClick={handleSaveSettings}>
              Save Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
