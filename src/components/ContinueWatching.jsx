import React from 'react';
import { Play } from 'lucide-react';
import { CONTINUE_WATCHING } from '../data/moviesData';

export default function ContinueWatching({ items = CONTINUE_WATCHING, onPlayMovie }) {
  return (
    <section className="section-container">
      <div className="section-header">
        <h2 className="section-title">Continue Watching</h2>
      </div>

      <div className="continue-watching-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="continue-card"
            onClick={() => onPlayMovie(item)}
          >
            <div className="continue-thumbnail-wrapper">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="continue-thumbnail"
              />
              <div className="play-overlay-icon">
                <div className="play-circle">
                  <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
                </div>
              </div>
              
              {/* Bottom Progress Bar Indicator */}
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="continue-info">
              <div className="continue-title">{item.title}</div>
              <div className="continue-subtitle">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
