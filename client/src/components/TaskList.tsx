import { useTasks } from '../context/TaskContext.js';
import { TaskItem } from './TaskItem.js';
import { PortalIcon } from './Icons.js';

export function TaskList() {
  const { tasks, isLoading, filter } = useTasks();

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-2.5" aria-busy="true" aria-label="Loading task directives">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-surface/60 border border-border/80 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        role="status"
        className="text-center py-16 px-4 bg-surface/40 border border-dashed border-border rounded-xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-accent-faint border border-accent/30 mx-auto flex items-center justify-center text-accent mb-3.5 portal-glow-subtle">
          <PortalIcon size={28} />
        </div>
        <h3 className="text-sm font-bold font-mono text-text">
          {filter.search || (filter.status && filter.status !== 'all') || (filter.priority && filter.priority !== 'all') || (filter.category && filter.category !== 'all')
            ? 'No quantum directives match current scanner parameters'
            : 'Containment field empty // No active directives in memory'}
        </h3>
        <p className="text-xs text-text-muted mt-1.5 max-w-md mx-auto leading-relaxed">
          {filter.search || (filter.status && filter.status !== 'all') || (filter.priority && filter.priority !== 'all') || (filter.category && filter.category !== 'all')
            ? 'Adjust your search queries or reset the sector and threat level filters.'
            : 'Inject a new directive above or travel to Dimension 35-C to harvest fresh experiments.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Task directive list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
