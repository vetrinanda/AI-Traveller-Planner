import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const PRESETS = [
  { label: '🏛️ History',        value: 'history' },
  { label: '🍜 Food & Dining',  value: 'food' },
  { label: '🎨 Art & Museums',  value: 'art' },
  { label: '🌿 Nature & Parks', value: 'nature' },
  { label: '🛍️ Shopping',       value: 'shopping' },
  { label: '🎭 Entertainment',  value: 'entertainment' },
  { label: '🏖️ Beaches',        value: 'beaches' },
  { label: '📸 Photography',    value: 'photography' },
  { label: '🏔️ Adventure',      value: 'adventure' },
  { label: '🍷 Nightlife',      value: 'nightlife' },
  { label: '🧘 Wellness',       value: 'wellness' },
  { label: '⛪ Architecture',   value: 'architecture' },
  { label: '🚵 Sports',         value: 'sports' },
  { label: '🎵 Music & Events', value: 'music' },
];

export default function InterestSelector({ selected, onChange }) {
  const [custom, setCustom] = useState('');

  const toggle = (v) =>
    selected.includes(v) ? onChange(selected.filter((x) => x !== v)) : onChange([...selected, v]);

  const addCustom = () => {
    const v = custom.trim();
    if (v && !selected.includes(v)) { onChange([...selected, v]); setCustom(''); }
  };

  return (
    <div className="space-y-5">
      {/* Preset grid */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(({ label, value }) => (
          <button key={value} onClick={() => toggle(value)}
            className={`chip ${selected.includes(value) ? 'selected' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            className="input-field text-sm"
            style={{ paddingLeft: '1rem', paddingTop: '0.65rem', paddingBottom: '0.65rem' }}
            placeholder="Add a custom interest…"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          />
        </div>
        <button onClick={addCustom} disabled={!custom.trim()}
          className="btn btn-ghost flex items-center gap-1.5 text-sm shrink-0"
          style={{ padding: '0.65rem 1.1rem' }}>
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((v) => {
            const preset = PRESETS.find((p) => p.value === v);
            return (
              <span key={v} className="chip selected text-xs">
                {preset ? preset.label : v}
                <button onClick={() => toggle(v)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
                  <X size={11} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
