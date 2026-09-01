import { useTasks } from '../context/TaskContext.js';
import { PriorityLevel } from '../types/index.js';
import { SearchIcon, FilterIcon, TrashIcon, XIcon } from './Icons.js';

export function FilterBar() {
  const { filter, setFilter, clearCompleted, tasks } = useTasks();

  const completedCount = tasks.filter((t) => t.completed).length;

  // Extract unique categories from current tasks
  const availableCategories = Array.from(
    new Set(tasks.map((t) => t.category).filter(Boolean))
  );

  return (
    <div className="bg-surface/90 border border-border rounded-xl p-3.5 mb-4 shadow-sm space-y-3">
      {/* Top Search & Clear */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none"
          />
          <input
            type="text"
            value={filter.search || ''}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Scan quantum directives by keyword or parameters..."
            className="w-full bg-bg border border-border focus:border-accent text-xs text-text rounded-lg pl-9 pr-8 py-2 outline-none placeholder:text-text-faint transition-colors focus-ring font-sans"
          />
          {filter.search && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, search: '' }))}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text p-0.5 rounded"
            >
              <XIcon size={14} />
            </button>
          )}
        </div>

        {/* Clear Completed Tasks Button */}
        {completedCount > 0 && (
          <button
            onClick={() => clearCompleted()}
            aria-label={`Flush ${completedCount} synthesized experiments`}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-danger-faint hover:bg-danger/20 border border-danger/30 text-danger transition-colors flex items-center justify-center gap-1.5 focus-ring shrink-0"
          >
            <TrashIcon size={14} />
            <span>Flush Completed ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60 text-xs font-mono">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-bg p-1 rounded-lg border border-border">
          {(
            [
              { id: 'all', label: 'All Protocols' },
              { id: 'pending', label: 'Active' },
              { id: 'completed', label: 'Synthesized' },
            ] as const
          ).map((st) => {
            const active = filter.status === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setFilter((prev) => ({ ...prev, status: st.id }))}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  active
                    ? 'bg-surface text-accent font-bold shadow-sm border border-border/80'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Priority & Category Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority Select */}
          <div className="flex items-center gap-1">
            <FilterIcon size={12} className="text-text-faint" />
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  priority: e.target.value as 'all' | PriorityLevel,
                }))
              }
              aria-label="Filter by threat priority"
              className="bg-bg border border-border hover:border-text-faint text-text-muted hover:text-text text-[11px] rounded-lg px-2.5 py-1 outline-none font-mono cursor-pointer transition-colors"
            >
              <option value="all">All Threat Levels</option>
              <option value="urgent">Red Alert (Urgent)</option>
              <option value="high">Plasma Leak (High)</option>
              <option value="medium">Lab Routine (Medium)</option>
              <option value="low">Jerry Level (Low)</option>
            </select>
          </div>

          {/* Category Select */}
          {availableCategories.length > 0 && (
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              aria-label="Filter by sector category"
              className="bg-bg border border-border hover:border-text-faint text-text-muted hover:text-text text-[11px] rounded-lg px-2.5 py-1 outline-none font-mono cursor-pointer transition-colors"
            >
              <option value="all">All Sectors</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  #{c}
                </option>
              ))}
            </select>
          )}

          {/* Sort By Select */}
          <select
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
              setFilter((prev) => ({ ...prev, sortBy, sortOrder }));
            }}
            aria-label="Sort protocols"
            className="bg-bg border border-border hover:border-text-faint text-text-muted hover:text-text text-[11px] rounded-lg px-2.5 py-1 outline-none font-mono cursor-pointer transition-colors"
          >
            <option value="created_at-desc">Newest Injected</option>
            <option value="created_at-asc">Oldest Injected</option>
            <option value="due_date-asc">Deadline (Urgent First)</option>
            <option value="priority-desc">Threat Priority High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
