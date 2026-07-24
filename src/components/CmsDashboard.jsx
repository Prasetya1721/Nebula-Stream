import React, { useState } from 'react';
import { LayoutDashboard, Plus, Edit, Trash2, Film, Radio, Sparkles, RefreshCw, CheckCircle2, Play, Search, Video } from 'lucide-react';
import CmsEditModal from './CmsEditModal';

export default function CmsDashboard({ 
  movies, 
  setMovies, 
  liveChannels, 
  setLiveChannels, 
  heroFeatured, 
  setHeroFeatured, 
  onResetData, 
  onPlayMovie 
}) {
  const [activeTab, setActiveTab] = useState('titles'); // 'titles' | 'episodes' | 'livetv' | 'hero'
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('All');
  
  // Modals state
  const [editingItem, setEditingItem] = useState(null); // null = closed, {} = add new, item = edit existing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New Episode form state inside Episode Manager
  const [selectedSeriesId, setSelectedSeriesId] = useState(movies.find(m => m.episodes && m.episodes.length > 0)?.id || movies[0]?.id);
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpDuration, setNewEpDuration] = useState('45m');
  const [newEpVideoUrl, setNewEpVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');

  // Filtered titles
  const filteredMovies = movies.filter((m) => {
    if (formatFilter !== 'All' && m.type !== formatFilter) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return m.title.toLowerCase().includes(term) || (m.subtitle && m.subtitle.toLowerCase().includes(term));
    }
    return true;
  });

  // Handlers for Movies CRUD
  const handleSaveTitle = (updatedItem) => {
    const existingIndex = movies.findIndex(m => m.id === updatedItem.id);
    if (existingIndex >= 0) {
      const updatedList = [...movies];
      updatedList[existingIndex] = updatedItem;
      setMovies(updatedList);
    } else {
      setMovies([updatedItem, ...movies]);
    }
  };

  const handleDeleteTitle = (id) => {
    if (window.confirm('Are you sure you want to delete this title from the catalog?')) {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  // Handlers for Episodes
  const currentSeries = movies.find(m => m.id === selectedSeriesId);

  const handleAddEpisode = (e) => {
    e.preventDefault();
    if (!newEpTitle.trim() || !currentSeries) return;

    const newEp = {
      id: `ep-${Date.now()}`,
      episodeNumber: (currentSeries.episodes?.length || 0) + 1,
      title: newEpTitle,
      duration: newEpDuration,
      description: `Official episode of ${currentSeries.title}.`,
      thumbnail: currentSeries.poster || currentSeries.backdrop,
      videoUrl: newEpVideoUrl
    };

    const updatedSeries = {
      ...currentSeries,
      episodes: [...(currentSeries.episodes || []), newEp]
    };

    handleSaveTitle(updatedSeries);
    setNewEpTitle('');
  };

  const handleDeleteEpisode = (epId) => {
    if (!currentSeries) return;
    const updatedEpisodes = currentSeries.episodes.filter(ep => ep.id !== epId);
    handleSaveTitle({ ...currentSeries, episodes: updatedEpisodes });
  };

  // Handlers for Live Channels
  const handleEditChannel = (channelId, field, value) => {
    const updatedChannels = liveChannels.map(ch => ch.id === channelId ? { ...ch, [field]: value } : ch);
    setLiveChannels(updatedChannels);
  };

  return (
    <section className="section-container" style={{ paddingTop: '20px' }}>
      {/* CMS Header */}
      <div className="section-header-wrap">
        <div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard color="var(--accent-purple)" size={28} /> Nebulax Content Management System (CMS)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            Manage catalog titles, video stream URLs, episode listings, live TV channels, and hero banners.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={onResetData} title="Reset all data to default">
            <RefreshCw size={16} /> Reset Default Data
          </button>
          
          <button 
            className="primary-action-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => {
              setEditingItem(null);
              setIsEditModalOpen(true);
            }}
          >
            <Plus size={18} /> Add New Title
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="cms-tabs-bar">
        <button 
          className={`cms-tab-btn ${activeTab === 'titles' ? 'active' : ''}`}
          onClick={() => setActiveTab('titles')}
        >
          <Film size={16} /> Titles & Videos ({movies.length})
        </button>
        <button 
          className={`cms-tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('episodes')}
        >
          <Video size={16} /> Episode Manager
        </button>
        <button 
          className={`cms-tab-btn ${activeTab === 'livetv' ? 'active' : ''}`}
          onClick={() => setActiveTab('livetv')}
        >
          <Radio size={16} /> Live Channels ({liveChannels.length})
        </button>
        <button 
          className={`cms-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          <Sparkles size={16} /> Featured Hero Banner
        </button>
      </div>

      {/* TAB 1: TITLES & VIDEOS */}
      {activeTab === 'titles' && (
        <div className="cms-panel glass-panel">
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div className="search-trigger-btn" style={{ background: 'rgba(255,255,255,0.06)', width: '320px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search catalog titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'Movies', 'Web Series'].map((f) => (
                <button
                  key={f}
                  className={`type-toggle-btn ${formatFilter === f ? 'active' : ''}`}
                  onClick={() => setFormatFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Titles Table */}
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title & Subtitle</th>
                  <th>Type</th>
                  <th>Rating / Year</th>
                  <th>Video Stream URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <img src={m.poster} alt={m.title} className="cms-thumb-cell" />
                    </td>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '15px' }}>{m.title}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.subtitle || m.genre}</div>
                    </td>
                    <td>
                      <span className={`cms-badge ${m.type === 'Web Series' ? 'badge-series' : 'badge-movie'}`}>
                        {m.type}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '700' }}>⭐ {m.rating}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.year}</div>
                    </td>
                    <td>
                      <div className="cms-url-cell" title={m.videoUrl}>
                        {m.videoUrl}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="cms-action-icon-btn" onClick={() => onPlayMovie(m)} title="Preview Video">
                          <Play size={16} />
                        </button>
                        <button 
                          className="cms-action-icon-btn" 
                          onClick={() => {
                            setEditingItem(m);
                            setIsEditModalOpen(true);
                          }} 
                          title="Edit Metadata & Video"
                        >
                          <Edit size={16} />
                        </button>
                        <button className="cms-action-icon-btn danger" onClick={() => handleDeleteTitle(m.id)} title="Delete Title">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EPISODE MANAGER */}
      {activeTab === 'episodes' && (
        <div className="cms-panel glass-panel">
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Select Series to Manage Episodes:
            </label>
            <select 
              className="custom-select" 
              style={{ width: '100%', maxWidth: '400px' }}
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
            >
              {movies.filter(m => m.type === 'Web Series' || m.episodes).map((s) => (
                <option key={s.id} value={s.id}>{s.title} ({s.episodes ? s.episodes.length : 0} episodes)</option>
              ))}
            </select>
          </div>

          {currentSeries && (
            <div>
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>
                Episodes for {currentSeries.title}
              </h3>

              {/* Add Episode Form */}
              <form onSubmit={handleAddEpisode} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 120px 2fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Episode Title</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    placeholder="e.g. E3: The Return" 
                    value={newEpTitle}
                    onChange={(e) => setNewEpTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Duration</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    placeholder="45m" 
                    value={newEpDuration}
                    onChange={(e) => setNewEpDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Video Stream URL</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={newEpVideoUrl}
                    onChange={(e) => setNewEpVideoUrl(e.target.value)}
                  />
                </div>
                <button type="submit" className="primary-action-btn">
                  + Add Episode
                </button>
              </form>

              {/* Episode List Table */}
              <div className="cms-table-wrapper">
                <table className="cms-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Thumbnail</th>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>Video URL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentSeries.episodes || []).map((ep, idx) => (
                      <tr key={ep.id}>
                        <td>{idx + 1}</td>
                        <td><img src={ep.thumbnail} alt={ep.title} className="cms-thumb-cell" /></td>
                        <td><strong style={{ color: '#fff' }}>{ep.title}</strong></td>
                        <td>{ep.duration}</td>
                        <td><div className="cms-url-cell">{ep.videoUrl}</div></td>
                        <td>
                          <button className="cms-action-icon-btn danger" onClick={() => handleDeleteEpisode(ep.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE TV BROADCASTS */}
      {activeTab === 'livetv' && (
        <div className="cms-panel glass-panel">
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Manage Live TV Broadcast Channels</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {liveChannels.map((ch) => (
              <div key={ch.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '14px', display: 'grid', gridTemplateColumns: '120px 1fr 1fr 2fr', gap: '16px', alignItems: 'center' }}>
                <img src={ch.thumbnail} alt={ch.channelName} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Channel Name</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={ch.channelName} 
                    onChange={(e) => handleEditChannel(ch.id, 'channelName', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Show</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={ch.currentShow} 
                    onChange={(e) => handleEditChannel(ch.id, 'currentShow', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Live Stream URL</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={ch.videoUrl} 
                    onChange={(e) => handleEditChannel(ch.id, 'videoUrl', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HERO FEATURED SWITCHER */}
      {activeTab === 'hero' && (
        <div className="cms-panel glass-panel">
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Select Home Hero Featured Movie</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {movies.map((m) => {
              const isSelected = heroFeatured.id === m.id;
              return (
                <div 
                  key={m.id}
                  className={`profile-card ${isSelected ? 'selected' : ''}`}
                  style={{ alignItems: 'flex-start', padding: '12px' }}
                  onClick={() => setHeroFeatured(m)}
                >
                  <img src={m.backdrop || m.poster} alt={m.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }} />
                  <strong style={{ color: '#fff', fontSize: '15px' }}>{m.title}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.years || m.year} • {m.seasons || m.genre}</span>
                  {isSelected && <CheckCircle2 className="selected-icon" size={20} color="var(--accent-purple)" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isEditModalOpen && (
        <CmsEditModal
          itemToEdit={editingItem}
          onSave={handleSaveTitle}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </section>
  );
}
