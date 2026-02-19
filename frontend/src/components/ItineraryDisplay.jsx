import React, { useState } from 'react';
import { Copy, Download, RotateCcw, CheckCheck, MapPin, Sparkles, Clock } from 'lucide-react';
import { Badge } from './ui/index';

/* ── Markdown renderer ─────────────────────────────────────────── */
function renderText(raw) {
  return raw
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/g,  '<em>$1</em>');
}

function ItineraryLine({ line, index }) {
  const style = { animationDelay: `${index * 0.025}s` };

  // H2 / H1 heading
  if (/^#{1,2}\s/.test(line)) {
    const text = line.replace(/^#+\s/, '');
    return (
      <div className="fade-up mt-6 mb-3 flex items-center gap-3" style={style}>
        <div className="h-px flex-1" style={{ background: 'rgba(139,92,246,0.2)' }} />
        <span className="text-xs font-700 tracking-widest uppercase"
          style={{ color: '#a78bfa', fontWeight: 700 }}>
          {text}
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(139,92,246,0.2)' }} />
      </div>
    );
  }

  // H3
  if (/^###\s/.test(line)) {
    return (
      <p className="fade-up text-sm font-semibold mt-3 mb-1" style={{ color: '#67e8f9', ...style }}>
        {line.replace(/^###\s/, '')}
      </p>
    );
  }

  // Bullet point
  if (/^[-*•]\s/.test(line)) {
    const content = line.replace(/^[-*•]\s/, '');
    return (
      <div className="fade-up flex gap-3 py-1" style={style}>
        <span className="shrink-0 mt-[5px]" style={{ color: '#7c3aed', fontSize: '0.5rem' }}>◆</span>
        <p className="text-sm leading-relaxed itinerary-body"
          style={{ color: 'rgba(241,240,255,0.75)' }}
          dangerouslySetInnerHTML={{ __html: renderText(content) }} />
      </div>
    );
  }

  // Numbered list
  if (/^\d+[.)]\s/.test(line)) {
    const num = line.match(/^\d+/)[0];
    const content = line.replace(/^\d+[.)]\s/, '');
    return (
      <div className="fade-up flex gap-3 py-1" style={style}>
        <span className="shrink-0 text-xs font-bold" style={{ color: '#f59e0b', minWidth: '1.2rem' }}>{num}.</span>
        <p className="text-sm leading-relaxed itinerary-body"
          style={{ color: 'rgba(241,240,255,0.75)' }}
          dangerouslySetInnerHTML={{ __html: renderText(content) }} />
      </div>
    );
  }

  // Bold-only line (time slot headers)
  if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
    return (
      <p className="fade-up text-sm font-bold mt-4 mb-1" style={{ color: '#fcd34d', ...style }}>
        {line.replace(/\*\*/g, '')}
      </p>
    );
  }

  // Regular text
  if (line.trim()) {
    return (
      <p className="fade-up text-sm leading-relaxed itinerary-body py-0.5"
        style={{ color: 'rgba(241,240,255,0.65)', ...style }}
        dangerouslySetInnerHTML={{ __html: renderText(line) }} />
    );
  }

  return <div className="h-2" />;
}

/* ── Main component ────────────────────────────────────────────── */
export default function ItineraryDisplay({ city, interests, itinerary, onReset }) {
  const [copied, setCopied] = useState(false);

  const lines = itinerary.split('\n').filter((l, i, arr) => !(l === '' && arr[i - 1] === ''));

  const copy = async () => {
    await navigator.clipboard.writeText(itinerary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([itinerary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url, download: `${city}_itinerary.txt`
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 fade-up">

      {/* ── Header card ── */}
      <div className="card border-glow p-6"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(34,211,238,0.04) 100%)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: '#8b5cf6' }} />
              <span className="label-sm">Your personalised itinerary</span>
            </div>
            <h2 className="heading-1 text-gradient">{city}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {interests.map((i) => (
                <Badge key={i} variant="violet">{i}</Badge>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={copy} className="btn btn-icon" title="Copy">
              {copied
                ? <CheckCheck size={16} style={{ color: '#4ade80' }} />
                : <Copy size={16} />}
            </button>
            <button onClick={download} className="btn btn-icon" title="Download">
              <Download size={16} />
            </button>
            <button onClick={onReset} className="btn btn-icon" title="New trip">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Itinerary body ── */}
      <div className="card p-6 max-h-[62vh] overflow-y-auto space-y-0.5">
        {lines.map((line, i) => <ItineraryLine key={i} line={line} index={i} />)}
      </div>

      {/* ── CTA ── */}
      <button onClick={onReset} className="btn btn-primary w-full">
        <Sparkles size={16} />
        Plan Another Trip
      </button>
    </div>
  );
}
