import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { MailIcon, LockIcon, UserIcon, LogInIcon, XIcon, AlertCircleIcon, UserPlusIcon, PortalGunIcon } from './Icons.js';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

const DEMO_PROFILES = [
  { label: 'Rick', email: 'rick@c137.universe', pass: 'portal_gun_password_123' },
  { label: 'Summer', email: 'summer@c137.universe', pass: 'password123' },
  { label: 'Morty', email: 'morty@c137.universe', pass: 'password123' },
  { label: 'Beth', email: 'beth@c137.universe', pass: 'password123' },
];

export function AuthModal({ isOpen, initialMode = 'login', onClose }: AuthModalProps) {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRegister(initialMode === 'register');
      setFormError(null);
      clearError();
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setFormError('All required fields must be populated.');
      return;
    }

    if (isRegister && !name.trim()) {
      setFormError('Please provide your operator name.');
      return;
    }

    if (isRegister && password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    try {
      if (isRegister) {
        await register(email.trim(), password, name.trim());
      } else {
        await login(email.trim(), password);
      }
      onClose();
    } catch {
      // Error handled in AuthContext
    }
  }

  function switchMode(mode: 'login' | 'register') {
    setIsRegister(mode === 'register');
    setFormError(null);
    clearError();
  }

  function fillDemo(demoEmail: string, demoPass: string) {
    setIsRegister(false);
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormError(null);
    clearError();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-surface border border-accent/40 rounded-2xl shadow-2xl p-6 relative portal-glow-subtle">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 text-text-muted hover:text-text p-1 rounded-md hover:bg-surface-hover transition-colors focus-ring"
        >
          <XIcon size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="w-11 h-11 rounded-xl bg-accent-faint border border-accent/40 flex items-center justify-center text-accent mb-3.5 portal-glow-subtle">
            {isRegister ? <UserPlusIcon size={24} /> : <PortalGunIcon size={24} />}
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold font-mono text-text">
            {isRegister ? 'New Dimension Clearance' : 'Interdimensional Authentication'}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {isRegister
              ? 'Establish encrypted clearance and isolate your experimental timeline.'
              : 'Enter authorized quantum credentials to decrypt your tasks.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-bg rounded-lg border border-border mb-5">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
              !isRegister
                ? 'bg-surface text-accent shadow-sm border border-border/80 font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
              isRegister
                ? 'bg-surface text-accent shadow-sm border border-border/80 font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Register Clearance
          </button>
        </div>

        {/* Error Alert */}
        {(formError || error) && (
          <div className="mb-4 p-3 rounded-lg bg-danger-faint border border-danger/30 text-danger text-xs flex items-center gap-2">
            <AlertCircleIcon size={16} className="shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">Operator Designation</label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morty Smith"
                  required
                  className="w-full bg-bg border border-border focus:border-accent text-text text-sm rounded-lg pl-9 pr-3 py-2 outline-none placeholder:text-text-faint transition-colors focus-ring font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-text-muted mb-1">Subnet Email Coordinates</label>
            <div className="relative">
              <MailIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@c137.universe"
                required
                className="w-full bg-bg border border-border focus:border-accent text-text text-sm rounded-lg pl-9 pr-3 py-2 outline-none placeholder:text-text-faint transition-colors focus-ring font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted mb-1">Quantum Passphrase</label>
            <div className="relative">
              <LockIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="w-full bg-bg border border-border focus:border-accent text-text text-sm rounded-lg pl-9 pr-3 py-2 outline-none placeholder:text-text-faint transition-colors focus-ring font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 bg-accent hover:bg-accent-hover text-accent-foreground font-mono font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 focus-ring shadow-md disabled:opacity-50 portal-glow-subtle"
          >
            {isRegister ? <UserPlusIcon size={16} /> : <LogInIcon size={16} />}
            <span>{isLoading ? 'Decrypting...' : isRegister ? 'Establish Clearance' : 'Open Portal Link'}</span>
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-5 pt-3.5 border-t border-border/60">
          <div className="text-[11px] font-mono text-text-muted mb-2 text-center">
            Quick demo credentials:
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {DEMO_PROFILES.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => fillDemo(p.email, p.pass)}
                className="px-2 py-1 text-[11px] font-mono rounded bg-bg hover:bg-surface-hover border border-border hover:border-accent/40 text-text transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
