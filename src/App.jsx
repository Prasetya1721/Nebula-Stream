import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroBanner from './components/HeroBanner';
import ContinueWatching from './components/ContinueWatching';
import CategoryTabs from './components/CategoryTabs';
import MovieGrid from './components/MovieGrid';
import LiveTVSection from './components/LiveTVSection';
import MoviesSeriesSection from './components/MoviesSeriesSection';
import VideoPlayerModal from './components/VideoPlayerModal';
import MovieDetailsModal from './components/MovieDetailsModal';
import SearchModal from './components/SearchModal';
import ProfileModal from './components/ProfileModal';

import { HERO_FEATURED, CONTINUE_WATCHING, NEW_RELEASES, PROFILES_DATA } from './data/moviesData';
import { Search, Film, Bookmark, Sparkles, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [headerTab, setHeaderTab] = useState('Movies'); // 'Movies' | 'Watch'
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [activeProfile, setActiveProfile] = useState(PROFILES_DATA[0]);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [watchlist, setWatchlist] = useState(['john-wick-4', 'money-heist']);
  const [toastMessage, setToastMessage] = useState('');

  const closeAllModals = () => {
    setIsSearchOpen(false);
    setIsProfileOpen(false);
    setPlayingMovie(null);
    setDetailsMovie(null);
  };

  const handleNavChange = (tabId) => {
    closeAllModals();
    setActiveNavTab(tabId);
    if (tabId === 'movies') {
      setHeaderTab('Movies');
    } else if (tabId === 'home') {
      setHeaderTab('Watch');
    }
  };

  const toggleWatchlist = (movieId) => {
    let newMsg = '';
    if (watchlist.includes(movieId)) {
      setWatchlist(watchlist.filter((id) => id !== movieId));
      newMsg = 'Removed from My Watchlist';
    } else {
      setWatchlist([...watchlist, movieId]);
      newMsg = 'Added to My Watchlist';
    }
    triggerGlobalToast(newMsg);
  };

  const triggerGlobalToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Category filter
  const filteredMovies = NEW_RELEASES.filter((movie) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Originals') return movie.isOriginal;
    if (selectedCategory === 'Movies') return movie.type === 'Movies';
    if (selectedCategory === 'Web Series') return movie.type === 'Web Series';
    return true;
  });

  return (
    <div className="app-container">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="global-toast-banner">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation / Mobile Bottom Dock */}
      <Sidebar
        activeTab={activeNavTab}
        setActiveTab={handleNavChange}
        onOpenSearch={() => {
          closeAllModals();
          setIsSearchOpen(true);
        }}
        onOpenProfile={() => {
          closeAllModals();
          setIsProfileOpen(true);
        }}
        activeProfile={activeProfile}
      />

      {/* Main Streaming Dashboard Body */}
      <main className="main-content">
        {/* Top Header Navbar */}
        <header className="top-header">
          <div className="header-tabs">
            <button
              className={`header-tab-btn ${headerTab === 'Movies' || activeNavTab === 'movies' ? 'active' : ''}`}
              onClick={() => handleNavChange('movies')}
            >
              Movies & Series
            </button>
            <button
              className={`header-tab-btn ${headerTab === 'Watch' && activeNavTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavChange('home')}
            >
              Watch Home
            </button>
          </div>

          <button
            className="search-trigger-btn"
            onClick={() => {
              closeAllModals();
              setIsSearchOpen(true);
            }}
          >
            <Search size={16} />
            <span>Search titles, actors, genres...</span>
          </button>
        </header>

        {/* Dynamic Views */}
        {activeNavTab === 'movies' ? (
          <MoviesSeriesSection
            onPlayMovie={(movie) => setPlayingMovie(movie)}
            onOpenDetails={(movie) => setDetailsMovie(movie)}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
          />
        ) : activeNavTab === 'livetv' || selectedCategory === 'Live TV' ? (
          <LiveTVSection onPlayMovie={(item) => setPlayingMovie(item)} />
        ) : activeNavTab === 'watchlist' ? (
          <section className="section-container" style={{ paddingTop: '20px' }}>
            <div className="section-header">
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bookmark color="var(--accent-purple)" size={26} /> My Saved Watchlist ({watchlist.length})
              </h2>
            </div>
            {watchlist.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Your watchlist is empty. Explore movies and click "+ Add to Watchlist".
              </div>
            ) : (
              <MovieGrid
                movies={NEW_RELEASES.filter((m) => watchlist.includes(m.id))}
                onPlayMovie={(movie) => setPlayingMovie(movie)}
                onOpenDetails={(movie) => setDetailsMovie(movie)}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            )}
          </section>
        ) : (
          <>
            {/* Featured Hero Banner */}
            <HeroBanner
              movie={HERO_FEATURED}
              onPlayMovie={(movie) => setPlayingMovie(movie)}
              onOpenDetails={(movie) => setDetailsMovie(movie)}
            />

            {/* Continue Watching Row */}
            <ContinueWatching
              items={CONTINUE_WATCHING}
              onPlayMovie={(movie) => setPlayingMovie(movie)}
            />

            {/* Category Filters: All, Originals, Live TV, Movies, Web Series */}
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Poster Card Grid */}
            <MovieGrid
              movies={filteredMovies}
              onPlayMovie={(movie) => setPlayingMovie(movie)}
              onOpenDetails={(movie) => setDetailsMovie(movie)}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
            />
          </>
        )}
      </main>

      {/* Modals & Overlays */}
      {playingMovie && (
        <VideoPlayerModal
          movie={playingMovie}
          onClose={() => setPlayingMovie(null)}
        />
      )}

      {detailsMovie && (
        <MovieDetailsModal
          movie={detailsMovie}
          onClose={() => setDetailsMovie(null)}
          onPlayMovie={(movie) => setPlayingMovie(movie)}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onPlayMovie={(movie) => setPlayingMovie(movie)}
          onOpenDetails={(movie) => setDetailsMovie(movie)}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)}
          activeProfile={activeProfile}
          setActiveProfile={setActiveProfile}
        />
      )}
    </div>
  );
}
