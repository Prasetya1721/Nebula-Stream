import React, { useState } from 'react';
import { Search, X, Play } from 'lucide-react';
import { NEW_RELEASES, CONTINUE_WATCHING, HERO_FEATURED } from '../data/moviesData';

export default function SearchModal({ onClose, onPlayMovie, onOpenDetails }) {
  const [searchTerm, setSearchTerm] = useState('');

  const allItems = [HERO_FEATURED, ...NEW_RELEASES, ...CONTINUE_WATCHING];
  const filtered = searchTerm.trim() === ''
    ? allItems
    : allItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)', padding: '12px 20px', borderRadius: '16px', marginBottom: '24px' }}>
          <Search size={22} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search movies, web series, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '16px',
              width: '100%',
              fontFamily: 'inherit'
            }}
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {searchTerm ? `Search Results (${filtered.length})` : 'Popular Searches'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((item, idx) => (
              <div
                key={item.id + idx}
                onClick={() => {
                  onClose();
                  onOpenDetails(item);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'var(--bg-card)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-light)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img
                  src={item.poster || item.thumbnail}
                  alt={item.title}
                  style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {item.subtitle || item.genre}
                  </div>
                </div>
                <button
                  className="btn-card-play"
                  style={{ flex: 'none', padding: '8px 16px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onPlayMovie(item);
                  }}
                >
                  <Play size={14} fill="currentColor" /> Play
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
