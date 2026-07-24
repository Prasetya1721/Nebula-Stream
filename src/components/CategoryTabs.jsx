import React from 'react';

export default function CategoryTabs({ selectedCategory, onSelectCategory }) {
  const categories = [
    { id: 'All', label: 'All' },
    { id: 'Originals', label: 'Originals' },
    { id: 'Live TV', label: 'Live TV' },
    { id: 'Movies', label: 'Movies' },
    { id: 'Web Series', label: 'Web Series' },
  ];

  return (
    <div className="filter-tabs-container">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            className={`filter-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
