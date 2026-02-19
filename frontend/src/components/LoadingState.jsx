import React, { useEffect, useState } from 'react';
import { Globe2, Compass, Sparkles, MapPinned } from 'lucide-react';

const STEPS = [
  { icon: Globe2,    text: 'Mapping your destination…' },
  { icon: Compass,   text: 'Gathering local insights…'  },
  { icon: Sparkles,  text: 'Crafting your itinerary…'   },
  { icon: MapPinned, text: 'Optimising the schedule…'   },
];

export default function LoadingState({ city }) {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const s = setInterval(() => setStep((p) => (p + 1) % STEPS.length), 1600);
    const d = setInterval(() => setDots((p) => (p % 3) + 1), 450);
    return () => { clearInterval(s); clearInterval(d); };
  }, []);

  const { icon: Icon, text } = STEPS[step];

  return (
    <div className="flex flex-col items-center py-16 gap-10">
      {/* Orbital spinner */}
      <div className="relative w-28 h-28">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full"
          style={{ border: '1px solid rgba(139,92,246,0.2)', animation: 'spin 4s linear infinite' }} />
        {/* Middle ring */}
        <div className="absolute inset-3 rounded-full"
          style={{ border: '1px dashed rgba(34,211,238,0.25)', animation: 'spin 2.5s linear infinite reverse' }} />
        {/* Inner ring */}
        <div className="absolute inset-6 rounded-full"
          style={{ border: '1px solid rgba(245,158,11,0.2)', animation: 'spin 1.8s linear infinite' }} />
        {/* Core dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent)', border: '1px solid rgba(139,92,246,0.4)' }}>
            <Icon size={18} style={{ color: '#a78bfa' }} />
          </div>
        </div>
        {/* Orbiting dot */}
        <div style={{
          position: 'absolute', top: '2px', left: '50%',
          width: '6px', height: '6px', marginLeft: '-3px',
          borderRadius: '50%', background: '#a78bfa',
          boxShadow: '0 0 8px rgba(167,139,250,0.8)',
          transformOrigin: '3px 54px',
          animation: 'spin 2s linear infinite',
        }} />
      </div>

      {/* Step label */}
      <div className="text-center space-y-4">
        <p className="font-semibold text-white/80 text-base">
          {text}{''.padEnd(dots, '.')}
        </p>

        {city && (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Planning your trip to <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{city}</span>
          </p>
        )}

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
