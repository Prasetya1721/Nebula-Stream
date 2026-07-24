import React from 'react';
import { Play, Plus, Info, Volume2, VolumeX } from 'lucide-react';
import { HERO_FEATURED } from '../data/moviesData';

export default function HeroBanner({ movie = HERO_FEATURED, onPlayMovie, onOpenDetails }) {
  const [isMuted, setIsMuted] = React.useState(true);

  return (
    <div className="hero-container">
      {/* Background Image backdrop */}
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="hero-backdrop"
      />

      {/* Subtle multi-directional gradients for seamless integration */}
      <div className="hero-overlay-gradient" />

      {/* Main Banner Content */}
      <div className="hero-content">
        {/* Title logo typography */}
        <h1 className="hero-title-logo">
          MONEY <span className="red-accent">HEIST</span>
        </h1>

        {/* Metadata stats */}
        <div className="hero-meta">
          <span>{movie.years}</span>
          <span className="dot-separator" />
          <span>{movie.seasons}</span>
          <span className="dot-separator" />
          <span>{movie.languages}</span>
          <span className="dot-separator" />
          <span style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
            {movie.rating}
          </span>
        </div>

        {/* Synopsis text */}
        <p className="hero-description">
          {movie.description}
        </p>

        {/* Genres listing */}
        <div className="hero-genres">
          {movie.genres.join(' | ')}
        </div>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button className="btn-watch-now" onClick={() => onPlayMovie(movie)}>
            <Play size={20} fill="currentColor" />
            Watch Now
          </button>
          
          <button className="btn-secondary" onClick={() => onOpenDetails(movie)}>
            <Info size={18} />
            More Info
          </button>

          <button className="btn-secondary" style={{ padding: '14px' }} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
