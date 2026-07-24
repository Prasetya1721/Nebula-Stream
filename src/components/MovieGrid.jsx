import React from 'react';
import { Star, Play, Plus, Check } from 'lucide-react';
import { NEW_RELEASES } from '../data/moviesData';

export default function MovieGrid({ movies = NEW_RELEASES, onPlayMovie, onOpenDetails, watchlist, toggleWatchlist }) {
  return (
    <section className="section-container">
      <div className="section-header">
        <h2 className="section-title">New Release</h2>
        <span className="see-all-link">See all</span>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => {
          const inWatchlist = watchlist.includes(movie.id);

          return (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => onOpenDetails(movie)}
            >
              {/* Poster Image */}
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
              />

              {/* Rating badge top-left */}
              <div className="movie-rating-badge">
                <Star size={12} fill="currentColor" />
                <span>{movie.rating}</span>
              </div>

              {/* Card Hover Overlay */}
              <div className="movie-card-overlay">
                <div className="movie-card-title">{movie.title}</div>
                <div className="movie-card-genre">{movie.subtitle || movie.genre}</div>

                <div className="movie-card-buttons" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn-card-play"
                    onClick={() => onPlayMovie(movie)}
                  >
                    <Play size={14} fill="currentColor" /> Play
                  </button>
                  <button
                    className="btn-card-icon"
                    onClick={() => toggleWatchlist(movie.id)}
                    title={inWatchlist ? "Remove from List" : "Add to My List"}
                  >
                    {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
