import React, { useState } from 'react';
import { X, Save, Film, Image, Link, Sparkles, Star } from 'lucide-react';

export default function CmsEditModal({ itemToEdit, onSave, onClose }) {
  const isNew = !itemToEdit;

  const [formData, setFormData] = useState({
    id: itemToEdit?.id || `title-${Date.now()}`,
    title: itemToEdit?.title || '',
    subtitle: itemToEdit?.subtitle || '',
    type: itemToEdit?.type || 'Movies', // 'Movies' | 'Web Series'
    year: itemToEdit?.year || new Date().getFullYear().toString(),
    rating: itemToEdit?.rating || '8.0',
    genre: itemToEdit?.genre || 'Action',
    genres: itemToEdit?.genres || ['Action', 'Drama'],
    isOriginal: itemToEdit?.isOriginal ?? true,
    poster: itemToEdit?.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    backdrop: itemToEdit?.backdrop || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    videoUrl: itemToEdit?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: itemToEdit?.description || '',
    cast: itemToEdit?.cast ? itemToEdit.cast.join(', ') : 'Lead Actor, Co-Star',
    episodes: itemToEdit?.episodes || []
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const formattedItem = {
      ...formData,
      genres: typeof formData.genres === 'string' ? formData.genres.split(',').map(g => g.trim()) : formData.genres,
      cast: typeof formData.cast === 'string' ? formData.cast.split(',').map(c => c.trim()) : formData.cast
    };

    onSave(formattedItem);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="profile-modal-container glass-panel" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <Film className="accent-icon" size={24} />
            <h2>{isNew ? 'Add New Title to Catalog' : `Edit Title: ${formData.title}`}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="cms-form-body">
          <div className="form-grid-2">
            <div className="cms-input-group">
              <label>Title *</label>
              <input
                type="text"
                className="cms-input"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. AVENGERS ENDGAME"
                required
              />
            </div>

            <div className="cms-input-group">
              <label>Subtitle / Franchise</label>
              <input
                type="text"
                className="cms-input"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="e.g. Marvel Studios Series"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="cms-input-group">
              <label>Format Type</label>
              <select
                className="custom-select"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="Movies">Movies</option>
                <option value="Web Series">Web Series</option>
              </select>
            </div>

            <div className="cms-input-group">
              <label>Release Year</label>
              <input
                type="text"
                className="cms-input"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
              />
            </div>

            <div className="cms-input-group">
              <label>IMDb Rating</label>
              <input
                type="text"
                className="cms-input"
                value={formData.rating}
                onChange={(e) => handleChange('rating', e.target.value)}
              />
            </div>
          </div>

          <div className="cms-input-group">
            <label>Genres (comma separated)</label>
            <input
              type="text"
              className="cms-input"
              value={Array.isArray(formData.genres) ? formData.genres.join(', ') : formData.genres}
              onChange={(e) => handleChange('genres', e.target.value)}
              placeholder="e.g. Action, Sci-Fi, Thriller"
            />
          </div>

          <div className="cms-input-group">
            <label>Video Stream URL (MP4 / WebM / HLS) *</label>
            <div className="input-with-icon">
              <Link size={16} color="var(--accent-purple)" />
              <input
                type="text"
                className="cms-input"
                value={formData.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/..."
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="cms-input-group">
              <label>Poster Image URL</label>
              <div className="input-with-icon">
                <Image size={16} color="var(--accent-cyan)" />
                <input
                  type="text"
                  className="cms-input"
                  value={formData.poster}
                  onChange={(e) => handleChange('poster', e.target.value)}
                />
              </div>
            </div>

            <div className="cms-input-group">
              <label>Backdrop Banner URL</label>
              <div className="input-with-icon">
                <Image size={16} color="var(--accent-purple)" />
                <input
                  type="text"
                  className="cms-input"
                  value={formData.backdrop}
                  onChange={(e) => handleChange('backdrop', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="cms-input-group">
            <label>Starring Cast (comma separated)</label>
            <input
              type="text"
              className="cms-input"
              value={formData.cast}
              onChange={(e) => handleChange('cast', e.target.value)}
              placeholder="e.g. Keanu Reeves, Laurence Fishburne"
            />
          </div>

          <div className="cms-input-group">
            <label>Synopsis Description</label>
            <textarea
              className="cms-textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief summary of the movie or series plot..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-action-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
