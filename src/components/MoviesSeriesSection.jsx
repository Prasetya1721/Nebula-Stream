import React, { useState } from 'react';
import { Film, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import MovieGrid from './MovieGrid';
import { NEW_RELEASES } from '../data/moviesData';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Animation'];

export default function MoviesSeriesSection({ onPlayMovie, onOpenDetails, watchlist, toggleWatchlist }) {
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'Movies' | 'Web Series'
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'year' | 'title'

  // Filtering
  const filteredList = NEW_RELEASES.filter((item) => {
    // Type Filter
    if (selectedType === 'Movies' && item.type !== 'Movies') return false;
    if (selectedType === 'Web Series' && item.type !== 'Web Series') return false;
    
    // Genre Filter
    if (selectedGenre !== 'All') {
      const matchPrimary = item.genre && item.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      const matchArray = item.genres && item.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
      if (!matchPrimary && !matchArray) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
    if (sortBy === 'year') return parseInt(b.year) - parseInt(a.year);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <section className="section-container" style={{ paddingTop: '20px' }}>
      {/* Header Bar */}
      <div className="section-header-wrap">
        <div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Film color="var(--accent-cyan)" size={26} /> Explore Movies & Web Series
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            Discover blockbuster movies, exclusive originals, and trending binge-worthy series.
          </p>
        </div>

        {/* Sorting selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SlidersHorizontal size={18} color="var(--text-muted)" />
          <select 
            className="custom-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Top Rated (Highest First)</option>
            <option value="year">Newest Release</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Type Toggle & Genre Filter Bar */}
      <div className="filter-bar-container">
        {/* Type selector buttons */}
        <div className="type-toggle-group">
          <button 
            className={`type-toggle-btn ${selectedType === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedType('All')}
          >
            All Format
          </button>
          <button 
            className={`type-toggle-btn ${selectedType === 'Movies' ? 'active' : ''}`}
            onClick={() => setSelectedType('Movies')}
          >
            Movies Only
          </button>
          <button 
            className={`type-toggle-btn ${selectedType === 'Web Series' ? 'active' : ''}`}
            onClick={() => setSelectedType('Web Series')}
          >
            Web Series
          </button>
        </div>

        {/* Genre Pill Filter */}
        <div className="genre-pills">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`genre-pill ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid Result */}
      {filteredList.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No titles found matching your genre and format filter.
        </div>
      ) : (
        <MovieGrid
          movies={filteredList}
          onPlayMovie={onPlayMovie}
          onOpenDetails={onOpenDetails}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
        />
      )}
    </section>
  );
}
