import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext.js';
import { PriorityLevel } from '../types/index.js';
import { PlusIcon, TagIcon, CalendarIcon, AlertCircleIcon, FlaskIcon } from './Icons.js';

const QUICK_CATEGORIES = ['science', 'maintenance', 'security', 'research', 'homework', 'robotics'];

export function TaskForm() {
  const { createTask, isLoading } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [category, setCategory] = useState('science');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Directive title is required');
      return;
    }

    try {
      setError(null);
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category.trim() || 'general',
        dueDate: dueDate || null,
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('science');
      setDueDate('');
      setIsExpanded(false);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch task');
    }
  }

  const priorityLabels: Record<PriorityLevel, { label: string; bg: string; text: string; border: string }> = {
    low: { label: 'LOW (JERRY)', bg: 'bg-surface', text: 'text-text-muted', border: 'border-border' },
    medium: { label: 'MED (LAB ROUTINE)', bg: 'bg-info-faint', text: 'text-info', border: 'border-info/30' },
    high: { label: 'HIGH (PLASMA LEAK)', bg: 'bg-warning-faint', text: 'text-warning', border: 'border-warning/30' },
    urgent: { label: 'URGENT (RED ALERT)', bg: 'bg-danger-faint', text: 'text-danger', border: 'border-danger/30' },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface/90 border border-border rounded-xl p-4 mb-6 shadow-md transition-all relative overflow-hidden"
    >
      {error && (
        <div className="mb-3 p-2.5 rounded-lg bg-danger-faint border border-danger/30 text-danger text-xs flex items-center gap-2">
          <AlertCircleIcon size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Title Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FlaskIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Inject new quantum directive (e.g. Synthesize dark matter in Dimension 35-C)..."
            className="w-full bg-bg border border-border focus:border-accent text-text text-sm rounded-lg pl-10 pr-3.5 py-2.5 outline-none placeholder:text-text-faint transition-colors focus-ring font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent text-accent-foreground font-mono font-bold text-sm rounded-lg transition-colors flex items-center gap-2 focus-ring shadow-sm portal-glow-subtle shrink-0"
        >
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Inject Protocol</span>
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-border/60 space-y-3.5 animate-in fade-in duration-200">
          {/* Description */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Experimental parameters, safety precautions, or dimension coordinates..."
              rows={2}
              className="w-full bg-bg border border-border focus:border-accent text-text text-xs rounded-lg px-3 py-2 outline-none placeholder:text-text-faint transition-colors focus-ring resize-none font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Priority selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-text-muted font-mono mr-1">Threat Level:</span>
              {(['low', 'medium', 'high', 'urgent'] as PriorityLevel[]).map((lvl) => {
                const active = priority === lvl;
                const config = priorityLabels[lvl];
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                      active
                        ? `${config.bg} ${config.text} ${config.border} font-bold ring-1 ring-accent/40 shadow-sm`
                        : 'bg-bg text-text-muted border-border hover:border-text-faint'
                    }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Due Date Input */}
            <div className="flex items-center gap-1.5 bg-bg border border-border rounded-md px-2.5 py-1 text-xs">
              <CalendarIcon size={14} className="text-accent" />
              <span className="text-[11px] font-mono text-text-muted">Deadline:</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent text-xs text-text outline-none font-mono cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
              <TagIcon size={12} className="text-accent" /> Sector:
            </span>
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  category.toLowerCase() === cat
                    ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                    : 'bg-bg text-text-faint hover:text-text border border-border hover:border-text-muted'
                }`}
              >
                #{cat}
              </button>
            ))}
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="custom sector"
              className="bg-bg border border-border text-text text-[11px] font-mono px-2 py-0.5 rounded outline-none w-24 placeholder:text-text-faint focus:border-accent"
            />
          </div>
        </div>
      )}
    </form>
  );
}
