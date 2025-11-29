import React from "react";
import { Mail, Linkedin, Share2, Link as LinkIcon } from "lucide-react";

const SocialShareButtons = ({ title, url: propUrl }) => {
  // If parent did not pass url, use the current page URL
  const url =
    propUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this data analysis by Patrick Britton: ${title}`,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      // fallback for older browsers
      const temp = document.createElement("input");
      temp.value = url;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      alert("Link copied!");
    }
  };

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(`I found this interesting post:\n${url}`)}`;

  return (
    <div className="social-share-bar">
      <button onClick={handleNativeShare} className="share-btn native-share">
        <Share2 size={20} />
        <span>Share</span>
      </button>

      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn linkedin"
      >
        <Linkedin size={20} />
      </a>

      <a href={mailtoUrl} className="share-btn email">
        <Mail size={20} />
      </a>

      <button onClick={handleCopy} className="share-btn copy-link">
        <LinkIcon size={20} />
      </button>
    </div>
  );
};

export default SocialShareButtons;
