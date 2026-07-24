import React, { useState } from 'react';
import { X, Play, Plus, Check, Star, ShieldCheck, Clock, Tag, Film, ThumbsUp } from 'lucide-react';
import { NEW_RELEASES } from '../data/moviesData';

export default function MovieDetailsModal({ movie, onClose, onPlayMovie, watchlist, toggleWatchlist }) {
  if (!movie) return null;
  const inWatchlist = watchlist.includes(movie.id);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'episodes' | 'similar'
  const [userRating, setUserRating] = useState(0);
  const [liked, setLiked] = useState(false);

  // Recommendations
  const similarTitles = NEW_RELEASES.filter(
    (m) => m.id !== movie.id && (m.type === movie.type || (m.genres && movie.genres && m.genres.some(g => movie.genres.includes(g))))
  ).slice(0, 3);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Banner */}
        <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
          <img
            src={movie.backdrop || movie.poster || movie.thumbnail}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, var(--bg-modal) 0%, rgba(17, 18, 29, 0.4) 60%, rgba(17, 18, 29, 0) 100%)'
          }} />

          <div style={{ position: 'absolute', bottom: '24px', left: '32px', right: '32px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {movie.title}
            </h2>
            <div style={{ fontSize: '15px', color: 'var(--accent-purple)', fontWeight: '600', marginBottom: '16px' }}>
              {movie.subtitle}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="btn-watch-now"
                onClick={() => {
                  onClose();
                  onPlayMovie(movie);
                }}
              >
                <Play size={18} fill="currentColor" /> Play Now
              </button>

              <button
                className="btn-secondary"
                onClick={() => toggleWatchlist(movie.id)}
              >
                {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>

              <button 
                className={`btn-secondary ${liked ? 'active-like' : ''}`}
                onClick={() => setLiked(!liked)}
                title="Like Title"
              >
                <ThumbsUp size={18} fill={liked ? "var(--accent-purple)" : "none"} />
                {liked ? "Liked" : "Like"}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Overview / Episodes / Similar) */}
        <div style={{ padding: '0 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '24px' }}>
          <button 
            className={`details-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {movie.episodes && (
            <button 
              className={`details-tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
              onClick={() => setActiveTab('episodes')}
            >
              Episodes ({movie.episodes.length})
            </button>
          )}
          <button 
            className={`details-tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
            onClick={() => setActiveTab('similar')}
          >
            More Like This
          </button>
        </div>

        {/* Modal Body Info */}
        <div style={{ padding: '24px 32px 32px' }}>
          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: '700' }}>
                  <Star size={16} fill="currentColor" /> {movie.rating || '8.5'}
                </span>
                <span>•</span>
                <span>{movie.year || '2023'}</span>
                <span>•</span>
                <span style={{ border: '1px solid var(--border-light)', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8' }}>
                  Ultra HD 4K
                </span>
                <span>•</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>
                  98% Match
                </span>
              </div>

              <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#cbd5e1', marginBottom: '24px' }}>
                {movie.description || 'Watch full movie in high definition stream with crystal clear audio and multi-language subtitle options on Nebulax Stream.'}
              </p>

              {movie.cast && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
                    Starring Cast:
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {movie.cast.join(', ')}
                  </div>
                </div>
              )}

              {/* Interactive Rate This Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: '12px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Your Rating:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={20}
                      className="star-rating-icon"
                      fill={star <= userRating ? "#f59e0b" : "none"} 
                      color={star <= userRating ? "#f59e0b" : "#64748b"}
                      onClick={() => setUserRating(star)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
                {userRating > 0 && <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '600' }}>({userRating * 2}/10)</span>}
              </div>
            </>
          )}

          {activeTab === 'episodes' && movie.episodes && (
            <div className="modal-episodes-grid">
              {movie.episodes.map((ep) => (
                <div key={ep.id} className="modal-episode-item" onClick={() => { onClose(); onPlayMovie(movie); }}>
                  <img src={ep.thumbnail} alt={ep.title} className="modal-episode-thumb" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#ffffff', fontSize: '15px' }}>{ep.title}</strong>
                      <span style={{ fontSize: '13px', color: 'var(--accent-purple)' }}>{ep.duration}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{ep.description}</p>
                  </div>
                  <button className="play-ep-btn" title="Play Episode">
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'similar' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {similarTitles.map((sim) => (
                <div 
                  key={sim.id} 
                  className="similar-card"
                  onClick={() => {
                    onClose();
                    onPlayMovie(sim);
                  }}
                >
                  <img src={sim.poster} alt={sim.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{sim.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sim.year} • ⭐ {sim.rating}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
