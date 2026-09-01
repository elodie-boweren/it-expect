import { useTasks } from '../context/TaskContext.js';
import { FlaskIcon, CheckCircleIcon, AlertCircleIcon, AtomIcon, ZapLaserIcon } from './Icons.js';

export function MetricsHeader() {
  const { stats, tasks } = useTasks();

  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate overdue tasks from live tasks state
  const now = new Date();
  const overdueCount = tasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
  ).length;

  return (
    <section aria-label="Garage Lab Telemetry" className="mb-6">
      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {/* Total Directives */}
        <div className="bg-surface/90 border border-border rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm hover:border-accent/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-accent-faint border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <AtomIcon size={22} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-text">{total}</div>
            <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
              Total Directives
            </div>
          </div>
        </div>

        {/* Completed Protocols */}
        <div className="bg-surface/90 border border-border rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm hover:border-accent/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-accent-faint border border-accent/40 flex items-center justify-center text-accent shrink-0">
            <CheckCircleIcon size={22} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-accent">{completed}</div>
            <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
              Synthesized
            </div>
          </div>
        </div>

        {/* Active In-Progress */}
        <div className="bg-surface/90 border border-border rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm hover:border-warning/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-warning-faint border border-warning/30 flex items-center justify-center text-warning shrink-0">
            <FlaskIcon size={20} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-warning">{pending}</div>
            <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
              Active Lab
            </div>
          </div>
        </div>

        {/* Overdue / Critical Breaches */}
        <div className="bg-surface/90 border border-border rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm hover:border-danger/40 transition-colors">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            overdueCount > 0 
              ? 'bg-danger-faint border border-danger/40 text-danger danger-glow' 
              : 'bg-surface border border-border text-text-faint'
          }`}>
            <AlertCircleIcon size={20} />
          </div>
          <div>
            <div className={`text-xl font-bold font-mono ${overdueCount > 0 ? 'text-danger font-black' : 'text-text'}`}>
              {overdueCount}
            </div>
            <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
              {overdueCount > 0 ? 'Plasma Alert' : 'Breaches'}
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Efficiency Progress Bar */}
      <div className="bg-surface/90 border border-border rounded-xl p-3.5 shadow-sm">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <div className="flex items-center gap-1.5 text-text-muted">
            <ZapLaserIcon size={14} className="text-accent" />
            <span className="text-text font-semibold">PORTAL SYNTHESIS EFFICIENCY:</span>
          </div>
          <span className="font-bold text-accent">{percent}% COMPLETION</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quantum task completion progress"
          className="w-full h-2.5 bg-bg rounded-full overflow-hidden p-0.5 border border-border"
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-accent to-emerald-400 rounded-full transition-all duration-500 portal-glow-subtle"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
