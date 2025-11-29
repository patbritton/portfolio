import React from 'react';
import { Mail, Linkedin, Share2, Link } from 'lucide-react';

const SocialShareButtons = ({ title, url }) => {
  
  // 1. Native Web Share API (Best for Mobile & Modern Desktop)
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
        text: `Check out this data analysis by Patrick Britton: ${title}`
      }).catch(error => console.log('Error sharing', error));
    } else {
      // Fallback for Desktop: Copy link
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // 2. LinkedIn Link Generator
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  
  // 3. Email Link Generator
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=I found this interesting post: ${encodeURIComponent(url)}`;

  return (
    <div className="social-share-bar">
      
      {/* 1. Share/Copy Link */}
      <button onClick={handleNativeShare} className="share-btn native-share">
        <Share2 size={20} />
        <span>Share Post</span>
      </button>

      {/* 2. LinkedIn */}
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="share-btn linkedin">
        <Linkedin size={20} />
      </a>

      {/* 3. Email */}
      <a href={mailtoUrl} className="share-btn email">
        <Mail size={20} />
      </a>
      
      {/* 4. Direct Copy Link (Visible on desktop) */}
       <button onClick={() => navigator.clipboard.writeText(url)} className="share-btn copy-link">
        <Link size={20} />
      </button>

    </div>
  );
};

export default SocialShareButtons;