import { useState } from 'react';
import { useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { DimensionHud } from './components/DimensionHud.js';
import { MetricsHeader } from './components/MetricsHeader.js';
import { TaskForm } from './components/TaskForm.js';
import { FilterBar } from './components/FilterBar.js';
import { TaskList } from './components/TaskList.js';
import { AuthModal } from './components/AuthModal.js';
import {
  ShieldCheckIcon,
  LogInIcon,
  UserPlusIcon,
  SpaceCruiserIcon,
  AtomIcon,
  FlaskIcon,
  ZapLaserIcon,
  MicroverseBatteryIcon,
} from './components/Icons.js';

export function App() {
  const { user, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  function openAuth(mode: 'login' | 'register' = 'login') {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans relative selection:bg-accent/30 selection:text-accent">
      <Navbar onOpenAuth={openAuth} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading ? (
          <div className="py-24 text-center" aria-busy="true">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4 portal-glow" />
            <p className="text-xs font-mono text-text-muted tracking-wider">
              CALIBRATING QUANTUM SUB-GRID // DIMENSION C-137...
            </p>
          </div>
        ) : !user ? (
          /* Unauthenticated Landing / Rick & Morty Cyber Hero */
          <div className="py-10 px-6 sm:px-10 bg-surface/90 border border-border/80 rounded-2xl text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Background Glow Accents */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-info/10 rounded-full blur-3xl pointer-events-none" />

            {/* Central Portal Icon Hero */}
            <div className="w-16 h-16 rounded-2xl bg-accent-faint border border-accent/40 mx-auto flex items-center justify-center text-accent mb-5 portal-glow shadow-inner">
              <SpaceCruiserIcon size={36} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-faint border border-accent/30 text-accent text-[11px] font-mono font-bold uppercase tracking-widest mb-3">
              <ZapLaserIcon size={13} />
              <span>Interdimensional Protocol C-137</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text tracking-tight">
              Garage Lab Directives
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-2.5 max-w-lg mx-auto leading-relaxed">
              Don't be a Jerry. Orchestrate your scientific experiments with zero telemetry leaks, 
              strict multi-tenant PostgreSQL isolation, and atomic state synchronization.
            </p>

            {/* Core Feature Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left">
              <div className="p-3.5 bg-bg/80 border border-border rounded-xl">
                <ShieldCheckIcon size={20} className="text-accent mb-2" />
                <span className="text-xs font-mono font-bold text-text block">Data Barrier</span>
                <span className="text-[11px] text-text-muted block mt-0.5">
                  Strict user-scoped PostgreSQL isolation
                </span>
              </div>

              <div className="p-3.5 bg-bg/80 border border-border rounded-xl">
                <MicroverseBatteryIcon size={20} className="text-warning mb-2" />
                <span className="text-xs font-mono font-bold text-text block">Direct Database</span>
                <span className="text-[11px] text-text-muted block mt-0.5">
                  Direct PostgreSQL connectivity & auto-seeder
                </span>
              </div>

              <div className="p-3.5 bg-bg/80 border border-border rounded-xl">
                <FlaskIcon size={20} className="text-info mb-2" />
                <span className="text-xs font-mono font-bold text-text block">High Performance</span>
                <span className="text-[11px] text-text-muted block mt-0.5">
                  Type-safe API and instant reactivity
                </span>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openAuth('register')}
                className="w-full sm:w-auto px-7 py-3 bg-accent hover:bg-accent-hover text-accent-foreground font-mono font-black text-sm rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-lg portal-glow focus-ring"
              >
                <UserPlusIcon size={18} />
                <span>Initialize Operator Clearance</span>
              </button>

              <button
                onClick={() => openAuth('login')}
                className="w-full sm:w-auto px-6 py-3 bg-surface hover:bg-surface-hover border border-border hover:border-text-faint text-text font-mono font-bold text-sm rounded-xl transition-colors inline-flex items-center justify-center gap-2 focus-ring"
              >
                <LogInIcon size={18} />
                <span>Access Console</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Rick's Garage Lab Mission Control */
          <div className="space-y-4">
            <DimensionHud />
            <MetricsHeader />
            <TaskForm />
            <FilterBar />
            <TaskList />
          </div>
        )}
      </main>

      {/* Futuristic Garage Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-[11px] font-mono text-text-faint bg-bg-subtle/50">
        <div className="flex items-center justify-center gap-2 mb-1">
          <AtomIcon size={14} className="text-accent" />
          <span>GARAGE LAB C-137 // SUB-ATOMIC STORAGE ACTIVE</span>
        </div>
        <p>WUBBA LUBBA DUB-DUB // ZERO UNICODE EMOJIS // HIGH-FIDELITY VECTOR CRAFT</p>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
export default App;
