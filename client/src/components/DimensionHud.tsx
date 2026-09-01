import { useState } from 'react';
import { MicroverseBatteryIcon, PortalGunIcon, AtomIcon, ZapLaserIcon, DimensionRadarIcon } from './Icons.js';

const RICK_QUOTES = [
  'Wubba Lubba Dub-Dub! The portal gun is primed and ready.',
  'To live is to risk it all, otherwise you’re just an inert chunk of randomly assembled molecules.',
  'I am a scientist. I invent, transform, create, and destroy for a living.',
  'Nobody exists on purpose. Nobody belongs anywhere. Everybody is gonna die. Come finish your tasks.',
  'Sometimes science is more art than science, mangoz404. A lot of people don’t get that.',
  'Boom! Big reveal! I turned your todo list into a quantum command terminal.',
];

const DIMENSIONS = [
  { id: 'C-137', name: 'DIMENSION C-137', label: 'Prime Reality', threat: 'OPTIMAL' },
  { id: '35-C', name: 'DIMENSION 35-C', label: 'Mega-Trees Area', threat: 'MODERATE' },
  { id: 'J19-ZETA-7', name: 'DIM-J19-Z7', label: 'Ovenless Brownies', threat: 'LOW' },
  { id: 'CITADEL', name: 'CITADEL SUBNET', label: 'Council Defense', threat: 'ELEVATED' },
];

export function DimensionHud() {
  const [activeDim, setActiveDim] = useState('C-137');
  const [quoteIndex, setQuoteIndex] = useState(0);

  function cycleQuote() {
    setQuoteIndex((prev) => (prev + 1) % RICK_QUOTES.length);
  }

  const currentDimension = DIMENSIONS.find((d) => d.id === activeDim) || DIMENSIONS[0];

  return (
    <div className="mb-6 p-3.5 bg-surface/90 border border-border rounded-xl shadow-lg relative overflow-hidden backdrop-blur-md">
      {/* Decorative portal corner pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Telemetry Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Dimension Selector */}
          <div className="flex items-center gap-1.5 text-text">
            <DimensionRadarIcon size={14} className="text-accent animate-pulse" />
            <span className="text-text-muted">LOCATION:</span>
            <span className="font-bold text-accent tracking-wider">{currentDimension.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent-faint text-accent border border-accent/30">
              {currentDimension.label}
            </span>
          </div>

          {/* Microverse Battery */}
          <div className="flex items-center gap-1.5 text-text-muted hidden md:flex">
            <MicroverseBatteryIcon size={14} className="text-warning" />
            <span>MICROVERSE:</span>
            <span className="text-warning font-semibold">99.4% VOLTAGE</span>
          </div>

          {/* Portal Gun Fluid */}
          <div className="flex items-center gap-1.5 text-text-muted hidden sm:flex">
            <PortalGunIcon size={14} className="text-accent" />
            <span>PORTAL FLUID:</span>
            <span className="text-accent font-semibold">OPTIMAL (89.2%)</span>
          </div>
        </div>

        {/* Dimension Switcher Pills */}
        <div className="flex items-center gap-1">
          {DIMENSIONS.map((dim) => (
            <button
              key={dim.id}
              onClick={() => setActiveDim(dim.id)}
              aria-label={`Switch to ${dim.name}`}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                activeDim === dim.id
                  ? 'bg-accent text-accent-foreground font-bold shadow-sm'
                  : 'bg-bg hover:bg-surface-hover text-text-faint hover:text-text border border-border/60'
              }`}
            >
              {dim.id}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Quote & Subnet Signal */}
      <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={cycleQuote}
          title="Click to cycle quantum wisdom"
          className="text-left text-text-muted hover:text-text transition-colors flex items-center gap-2 group flex-1"
        >
          <AtomIcon size={15} className="text-accent group-hover:rotate-90 transition-transform duration-300 shrink-0" />
          <span className="italic font-sans line-clamp-1">"{RICK_QUOTES[quoteIndex]}"</span>
        </button>

        <div className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-text-faint">
          <ZapLaserIcon size={12} className="text-accent" />
          <span>GARAGE LAB LINK [ACTIVE]</span>
        </div>
      </div>
    </div>
  );
}
