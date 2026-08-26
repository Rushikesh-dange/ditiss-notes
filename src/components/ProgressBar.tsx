"use client";

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const scrollListener = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      
      setReadingProgress(Number(scroll));
    }
    
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'transparent',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          height: '100%',
          backgroundColor: 'var(--accent-primary)',
          width: `${readingProgress * 100}%`,
          transition: 'width 0.1s ease-out',
        }}
      />
    </div>
  );
}
