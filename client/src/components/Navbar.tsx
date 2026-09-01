import { useAuth } from '../context/AuthContext.js';
import { PortalGunIcon, LogOutIcon, UserIcon, LogInIcon, UserPlusIcon, ShieldCheckIcon, AtomIcon } from './Icons.js';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="border-b border-border/80 bg-bg-subtle/90 backdrop-blur-md sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-faint border border-accent/40 flex items-center justify-center text-accent portal-glow-subtle">
            <PortalGunIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg tracking-tight text-text">
                C-137
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold tracking-widest border border-accent/30">
                PORTAL HUD
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-muted hidden sm:flex items-center gap-1.5">
              <AtomIcon size={12} className="text-accent" />
              <span>Interdimensional task orchestration & data isolation</span>
            </p>
          </div>
        </div>

        {/* User Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-text flex items-center justify-end gap-1.5">
                  <ShieldCheckIcon size={14} className="text-accent" />
                  {user.name}
                </span>
                <span className="text-xs text-text-muted font-mono">{user.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface border border-accent/30 flex items-center justify-center text-accent">
                <UserIcon size={16} />
              </div>
              <button
                onClick={() => logout()}
                disabled={isLoading}
                aria-label="Log out of account"
                className="px-3 py-1.5 text-xs font-mono rounded-md bg-surface hover:bg-surface-hover border border-border hover:border-text-faint text-text-muted hover:text-text transition-colors flex items-center gap-1.5 focus-ring"
              >
                <LogOutIcon size={14} />
                <span className="hidden sm:inline">Eject</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface hover:bg-surface-hover border border-border text-text hover:text-accent transition-colors flex items-center gap-1.5 font-mono focus-ring"
              >
                <LogInIcon size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-md bg-accent hover:bg-accent-hover text-accent-foreground transition-colors flex items-center gap-1.5 font-mono focus-ring shadow-sm portal-glow-subtle"
              >
                <UserPlusIcon size={14} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
