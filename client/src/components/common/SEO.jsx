import { useEffect } from 'react';

export const SEO = ({
  title = "Tara Typing — Free Online Typing Test",
  description = "Type Faster. Think Sharper. Free online typing speed test with real-time WPM, accuracy tracking, and global leaderboard.",
}) => {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
