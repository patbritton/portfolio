import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Hash } from 'lucide-react';
// Import the CSS file directly
import '../styles/search.css';

const SiteSearch = ({ posts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const toggleSearch = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 10);
    }
  }, [isOpen]);

  const filteredPosts = posts.filter(post => {
    const searchContent = (post.data.title + post.data.description + post.data.tags.join(' ')).toLowerCase();
    return searchContent.includes(query.toLowerCase());
  });

  return (
    <>
      <button onClick={toggleSearch} className="search-trigger" aria-label="Search">
        <Search size={20} />
      </button>

      {isOpen && (
        <div className="search-overlay" onClick={() => setIsOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="search-header">
              <Search size={20} className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search posts, tags, projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="search-results">
              {query.length > 0 ? (
                filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <a key={post.slug} href={`/blog/${post.slug}`} className="result-item">
                      <FileText size={16} className="item-icon" />
                      <div className="item-content">
                        <span className="item-title">{post.data.title}</span>
                        <span className="item-desc">{post.data.description?.slice(0, 60)}...</span>
                      </div>
                      {post.data.tags && (
                        <span className="item-tag">
                          <Hash size={10} /> {post.data.tags[0]}
                        </span>
                      )}
                    </a>
                  ))
                ) : (
                  <div className="no-results">No results found for "{query}"</div>
                )
              ) : (
                <div className="empty-state">
                  <p>Type to search documentation...</p>
                  <div className="shortcuts">
                    <span>Navigation</span> <kbd>↑</kbd> <kbd>↓</kbd>
                    <span>Select</span> <kbd>↵</kbd>
                  </div>
                </div>
              )}
            </div>

            <div className="search-footer">
              Search by <span className="brand">Patrick.mp.ls</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteSearch;