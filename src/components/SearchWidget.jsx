import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchWidget = ({ posts }) => {
  const [query, setQuery] = useState('');

  // Filter posts based on title or tags
  const filteredPosts = posts.filter(post => {
    const searchContent = (post.data.title + post.data.tags.join(' ')).toLowerCase();
    return searchContent.includes(query.toLowerCase());
  });

  return (
    <div className="search-wrapper" style={{ marginBottom: '2rem' }}>
      
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search posts..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 10px 10px 40px',
            background: '#0f172a', // Darker than sidebar
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#f8fafc',
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Live Results Dropdown */}
      {query.length > 0 && (
        <div className="search-results" style={{ marginTop: '0.5rem', display: 'grid', gap: '0.5rem' }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <a key={post.slug} href={`/blog/${post.slug}`} style={{
                display: 'block',
                background: '#1e293b',
                padding: '0.75rem',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid #334155'
              }}>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.95rem' }}>{post.data.title}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                   {post.data.pubDate.toString().slice(0,10)}
                </p>
              </a>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>No matching posts.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWidget;