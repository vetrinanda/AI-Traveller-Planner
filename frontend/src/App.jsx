import React, { useState } from 'react';
import axios from 'axios';
import { Plane, Sparkles, ArrowRight, AlertCircle, Globe2, Heart, Zap } from 'lucide-react';
import CityInput from './components/CityInput';
import InterestSelector from './components/InterestSelector';
import LoadingState from './components/LoadingState';
import ItineraryDisplay from './components/ItineraryDisplay';
import { Badge } from './components/ui/index';

/* ── Step indicator ──────────────────────────────────────────── */
function StepBar({ current }) {
  const steps = ['Destination', 'Interests', 'Itinerary'];
  const map = { destination: 0, interests: 1, loading: 2, result: 2 };
  const active = map[current] ?? 0;

  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
              style={{
                background:  i <= active ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.06)',
                color:       i <= active ? '#fff' : 'rgba(255,255,255,0.25)',
                boxShadow:   i === active ? '0 0 16px rgba(124,58,237,0.5)' : 'none',
              }}
            >
              {i < active ? '✓' : i + 1}
            </div>
            <span
              className="text-xs font-semibold hidden sm:block transition-colors duration-300"
              style={{ color: i === active ? '#c4b5fd' : 'rgba(255,255,255,0.2)' }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px max-w-12"
              style={{ background: i < active ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.07)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Main App ─────────────────────────────────────────────────── */
export default function App() {
  const [step, setStep]           = useState('destination');
  const [city, setCity]           = useState('');
  const [interests, setInterests] = useState([]);
  const [itinerary, setItinerary] = useState('');
  const [error, setError]         = useState('');

  /* ── Actions ── */
  const goInterests = () => {
    if (!city.trim()) { setError('Please enter a destination first.'); return; }
    setError(''); setStep('interests');
  };

  const generate = async () => {
    if (interests.length === 0) { setError('Choose at least one interest.'); return; }
    setError(''); setStep('loading');
    try {
      const { data } = await axios.post('/api/plan', { city, interests });
      setItinerary(data.itinerary);
      setStep('result');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Could not reach the server. Is the backend running?'
      );
      setStep('interests');
    }
  };

  const reset = () => {
    setCity(''); setInterests([]); setItinerary(''); setError(''); setStep('destination');
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen noise" style={{ background: 'var(--bg)' }}>

      {/* Mesh background */}
      <div className="mesh-bg" />

      {/* ── Nav ── */}
      <header className="relative z-20">
        <div className="container">
          <nav className="flex items-center justify-between py-5">
            {/* Logo */}
            <button onClick={reset} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                <Plane size={17} className="text-white" />
              </div>
              <div className="leading-none">
                <span className="font-extrabold text-white text-base tracking-tight">TripCraft</span>
                <span className="text-xs font-medium ml-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>AI</span>
              </div>
            </button>

            {/* Status pill */}
            <div className="glass flex items-center gap-2 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: '0 0 6px #4ade80' }} />
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Gemini 2.0 Flash
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10">
        <div className="container">

          {/* ── DESTINATION ── */}
          {step === 'destination' && (
            <div className="fade-up pt-8 pb-20">

              {/* Hero text */}
              <div className="text-center mb-12">
                <Badge variant="violet" className="mb-6 fade-up">
                  <Sparkles size={10} className="text-yellow-400" />
                  AI-Powered Day Trip Planner
                </Badge>

                <h1 className="display mb-5 fade-up fade-up-d1">
                  <span className="text-white">Your perfect</span>
                  <br />
                  <span className="text-gradient">day trip</span>
                  <br />
                  <span className="text-white">starts here.</span>
                </h1>

                <p className="text-base max-w-md mx-auto fade-up fade-up-d2"
                  style={{ color: 'rgba(241,240,255,0.5)', lineHeight: 1.8, fontWeight: 400 }}>
                  Tell us your destination and interests. Our AI crafts a
                  personalised, hour-by-hour itinerary in seconds.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-12 fade-up fade-up-d3">
                {[
                  { icon: Zap,    text: 'Under 10 seconds' },
                  { icon: Globe2, text: '100+ destinations' },
                  { icon: Heart,  text: 'Fully personalised' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.55)'
                    }}>
                    <Icon size={13} style={{ color: '#8b5cf6' }} />
                    {text}
                  </div>
                ))}
              </div>

              {/* Input card */}
              <div className="card border-glow p-7 fade-up fade-up-d4 max-w-lg mx-auto"
                style={{ background: 'rgba(12,12,30,0.8)' }}>

                <div className="space-y-2 mb-6">
                  <label className="label-sm flex items-center gap-2">
                    <Globe2 size={12} style={{ color: '#8b5cf6' }} />
                    Where are you headed?
                  </label>
                  <CityInput value={city} onChange={setCity} />
                </div>

                {error && (
                  <div className="error-box mb-4">
                    <AlertCircle size={15} />
                    {error}
                  </div>
                )}

                <button onClick={goInterests} className="btn btn-primary w-full">
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Quick picks */}
              <div className="text-center mt-10 fade-up" style={{ animationDelay: '0.4s' }}>
                <p className="label-sm mb-4">Quick picks</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['🗼 Paris','🗾 Tokyo','🗽 New York','🏛️ Rome','🌴 Bali','🌆 Dubai','🇮🇳 Bangalore'].map((d) => (
                    <button key={d}
                      onClick={() => setCity(d.split(' ').slice(1).join(' '))}
                      className="chip text-xs">
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── INTERESTS ── */}
          {step === 'interests' && (
            <div className="fade-up pt-10 pb-20 max-w-xl mx-auto">
              <StepBar current="interests" />

              <div className="text-center mb-8">
                <p className="label-sm mb-3">Step 2 of 3</p>
                <h2 className="heading-1 mb-3">
                  What do you love in{' '}
                  <span className="text-gradient">{city}</span>?
                </h2>
                <p className="text-sm" style={{ color: 'rgba(241,240,255,0.45)', lineHeight: 1.8 }}>
                  Pick your interests — the more you choose, the richer your itinerary.
                </p>
              </div>

              <div className="card p-6 space-y-5" style={{ background: 'rgba(12,12,30,0.8)' }}>
                <InterestSelector selected={interests} onChange={setInterests} />

                {error && (
                  <div className="error-box">
                    <AlertCircle size={15} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setStep('destination'); setError(''); }}
                    className="btn btn-ghost flex-none px-5">
                    ← Back
                  </button>
                  <button onClick={generate} disabled={interests.length === 0}
                    className="btn btn-primary flex-1">
                    <Sparkles size={16} />
                    Generate Itinerary
                  </button>
                </div>
              </div>

              <p className="text-center mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {interests.length} interest{interests.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* ── LOADING ── */}
          {step === 'loading' && (
            <div className="fade-up pt-10 pb-20 max-w-lg mx-auto">
              <StepBar current="loading" />
              <div className="card border-glow" style={{ background: 'rgba(12,12,30,0.8)' }}>
                <LoadingState city={city} />
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === 'result' && (
            <div className="pt-8 pb-20 max-w-2xl mx-auto">
              <StepBar current="result" />
              <ItineraryDisplay
                city={city}
                interests={interests}
                itinerary={itinerary}
                onReset={reset}
              />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Built with ✦ Gemini AI &nbsp;·&nbsp; LangGraph &nbsp;·&nbsp; FastAPI &nbsp;·&nbsp; React
        </p>
      </footer>
    </div>
  );
}
