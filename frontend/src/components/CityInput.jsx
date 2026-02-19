import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, ChevronDown } from 'lucide-react';

const CITIES = [
  { name: 'Paris', flag: '🇫🇷', desc: 'City of Light' },
  { name: 'Tokyo', flag: '🇯🇵', desc: 'Neon & Tradition' },
  { name: 'New York', flag: '🇺🇸', desc: 'The Big Apple' },
  { name: 'London', flag: '🇬🇧', desc: 'Royal Heritage' },
  { name: 'Rome', flag: '🇮🇹', desc: 'Eternal City' },
  { name: 'Dubai', flag: '🇦🇪', desc: 'City of Gold' },
  { name: 'Barcelona', flag: '🇪🇸', desc: 'Art & Architecture' },
  { name: 'Bangkok', flag: '🇹🇭', desc: 'Temple & Street Food' },
  { name: 'Sydney', flag: '🇦🇺', desc: 'Harbour City' },
  { name: 'Singapore', flag: '🇸🇬', desc: 'Garden City' },
  { name: 'Amsterdam', flag: '🇳🇱', desc: 'Canal City' },
  { name: 'Istanbul', flag: '🇹🇷', desc: 'Two Continents' },
  { name: 'Bali', flag: '🇮🇩', desc: 'Island of Gods' },
  { name: 'Kyoto', flag: '🇯🇵', desc: 'Ancient Japan' },
  { name: 'Prague', flag: '🇨🇿', desc: 'Golden City' },
  { name: 'Seoul', flag: '🇰🇷', desc: 'K-Culture Hub' },
  { name: 'Bangalore', flag: '🇮🇳', desc: 'Silicon Valley of India' },
  { name: 'Mumbai', flag: '🇮🇳', desc: 'City of Dreams' },
];

export default function CityInput({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const suggestions = query.length
    ? CITIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : CITIES.slice(0, 8);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (name) => {
    setQuery(name);
    onChange(name);
    setOpen(false);
  };

  const clear = () => { setQuery(''); onChange(''); };

  return (
    <div ref={ref} className="relative">
      {/* Input row */}
      <div className="relative">
        <MapPin size={16} style={{ color: 'rgba(139,92,246,0.8)' }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        <input
          className="input-field pr-10"
          placeholder="Search destination…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        {query ? (
          <button onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors z-10">
            <X size={15} />
          </button>
        ) : (
          <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.2)' }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden"
          style={{
            background: '#0e0e24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }}>
          <p className="label-sm px-4 pt-3 pb-2">
            {query ? 'Results' : 'Popular Destinations'}
          </p>
          {suggestions.map(({ name, flag, desc }) => (
            <button key={name} onMouseDown={() => select(name)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5">
              <span className="text-lg leading-none">{flag}</span>
              <span>
                <span className="text-sm font-600 text-white/90 font-semibold block leading-tight">{name}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
