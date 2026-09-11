"use client";

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function LiveViewerCount() {
  const [viewers, setViewers] = useState(451);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fluctuate the viewer count slightly every few seconds to look realistic
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 1; // -1 to +3
        return Math.max(451, prev + change); // Never drop below 451
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.4rem', 
      color: 'var(--text-secondary)', 
      fontSize: '0.8rem',
      background: 'rgba(67, 97, 238, 0.1)',
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      border: '1px solid rgba(67, 97, 238, 0.2)',
      marginRight: '0.5rem'
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        background: '#10B981', // green dot
        borderRadius: '50%',
        boxShadow: '0 0 8px #10B981',
        animation: 'pulse 2s infinite'
      }} />
      <span><strong style={{ color: 'var(--text-primary)' }}>{viewers}</strong> online</span>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
