import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 18;

export default function ParticleBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 15 + 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = Math.random() * 0.5 + 0.1;
      const colors = [
        'rgba(167,139,250,0.6)',
        'rgba(96,165,250,0.6)',
        'rgba(251,191,36,0.4)',
        'rgba(52,211,153,0.4)',
      ];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
    }
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
}
