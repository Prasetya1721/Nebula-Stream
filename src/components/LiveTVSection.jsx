import React, { useState } from 'react';
import { Tv, Radio, Eye, Play } from 'lucide-react';
import { LIVE_TV_CHANNELS } from '../data/moviesData';

export default function LiveTVSection({ onPlayMovie }) {
  const [activeChannel, setActiveChannel] = useState(LIVE_TV_CHANNELS[0]);

  return (
    <section className="section-container">
      <div className="section-header">
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio color="var(--accent-purple)" className="pulse-icon" /> Live Channels Broadcast
        </h2>
      </div>

      {/* Main Live Channel Broadcast Feature Box */}
      <div className="hero-container" style={{ height: '380px', marginBottom: '28px' }}>
        <img
          src={activeChannel.thumbnail}
          alt={activeChannel.channelName}
          className="hero-backdrop"
        />
        <div className="hero-overlay-gradient" />

        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', marginBottom: '12px', width: 'fit-content' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} /> LIVE BROADCAST
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
            {activeChannel.channelName}
          </h2>
          <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Now Playing: <strong style={{ color: 'white' }}>{activeChannel.currentShow}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981', fontWeight: '600', marginBottom: '20px' }}>
            <Eye size={16} /> {activeChannel.viewers}
          </div>

          <button className="btn-watch-now" onClick={() => onPlayMovie(activeChannel)}>
            <Play size={18} fill="currentColor" /> Watch Channel Live
          </button>
        </div>
      </div>

      {/* Channels List */}
      <div className="continue-watching-grid">
        {LIVE_TV_CHANNELS.map((ch) => (
          <div
            key={ch.id}
            className={`continue-card ${activeChannel.id === ch.id ? 'active' : ''}`}
            onClick={() => setActiveChannel(ch)}
            style={{
              borderColor: activeChannel.id === ch.id ? 'var(--accent-purple)' : 'var(--border-light)'
            }}
          >
            <div className="continue-thumbnail-wrapper">
              <img src={ch.thumbnail} alt={ch.channelName} className="continue-thumbnail" />
              <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>
                LIVE
              </div>
            </div>
            <div className="continue-info">
              <div className="continue-title">{ch.channelName}</div>
              <div className="continue-subtitle">{ch.currentShow}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
