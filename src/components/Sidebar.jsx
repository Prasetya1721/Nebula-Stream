import React from 'react';
import { Home, Search, Film, Tv, Bookmark, User, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenSearch, onOpenProfile, activeProfile }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search', action: onOpenSearch },
    { id: 'movies', icon: Film, label: 'Movies & Series' },
    { id: 'livetv', icon: Tv, label: 'Live TV' },
    { id: 'watchlist', icon: Bookmark, label: 'My Watchlist' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Logo / Brand Symbol */}
        <div className="sidebar-logo" onClick={() => setActiveTab('home')} title="Nebulax Stream">
          N<span>S</span>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-icon-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.action) {
                    item.action();
                  }
                }}
                title={item.label}
              >
                {isActive && <div className="active-indicator" />}
                <Icon size={22} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Avatar */}
      <div className="sidebar-bottom">
        <div 
          className="profile-avatar"
          onClick={onOpenProfile}
          title={`${activeProfile?.name || 'User'} Profile & Settings`}
          style={{ background: activeProfile?.avatarBg || 'linear-gradient(135deg, #6366f1, #a855f7)' }}
        >
          {activeProfile?.name ? activeProfile.name.charAt(0) : 'N'}
        </div>
      </div>
    </aside>
  );
}
