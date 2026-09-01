import React, { useState } from 'react';
import { Task, PriorityLevel } from '../types/index.js';
import { useTasks } from '../context/TaskContext.js';
import { CheckIcon, TrashIcon, EditIcon, TagIcon, CalendarIcon } from './Icons.js';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editPriority, setEditPriority] = useState<PriorityLevel>(task.priority);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const priorityStyles: Record<PriorityLevel, { tag: string; text: string; bg: string; border: string }> = {
    low: { tag: 'JERRY', text: 'text-text-muted', bg: 'bg-surface-hover', border: 'border-border' },
    medium: { tag: 'LAB ROUTINE', text: 'text-info', bg: 'bg-info-faint', border: 'border-info/30' },
    high: { tag: 'PLASMA LEAK', text: 'text-warning', bg: 'bg-warning-faint', border: 'border-warning/30' },
    urgent: { tag: 'RED ALERT', text: 'text-danger', bg: 'bg-danger-faint', border: 'border-danger/30' },
  };

  const categoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c === 'science' || c === 'robotics') return 'border-accent/40 text-accent bg-accent-faint';
    if (c === 'maintenance' || c === 'inventory') return 'border-warning/40 text-warning bg-warning-faint';
    if (c === 'security' || c === 'clinic') return 'border-danger/40 text-danger bg-danger-faint';
    if (c === 'research' || c === 'surgery') return 'border-portal-purple/40 text-purple-400 bg-portal-purple-faint';
    if (c === 'homework' || c === 'school') return 'border-cyan-400/40 text-cyan-400 bg-cyan-950/40';
    return 'border-border text-text-muted bg-bg';
  };

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTitle.trim()) return;

    await updateTask(task.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      category: editCategory.trim() || 'general',
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  }

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate).getTime() < Date.now();

  const formatDue = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSaveEdit}
        className="bg-surface border border-accent/60 rounded-xl p-4 mb-2.5 shadow-md portal-border-glow"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-bg border border-border focus:border-accent text-text text-sm rounded-lg px-3 py-2 outline-none font-sans"
            required
            autoFocus
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Parameters & instructions..."
            rows={2}
            className="w-full bg-bg border border-border focus:border-accent text-text text-xs rounded-lg px-3 py-2 outline-none font-sans resize-none"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Priority */}
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
              className="bg-bg border border-border text-text text-xs rounded-md px-2.5 py-1 font-mono outline-none cursor-pointer"
            >
              <option value="low">Jerry (Low)</option>
              <option value="medium">Lab Routine (Medium)</option>
              <option value="high">Plasma Leak (High)</option>
              <option value="urgent">Red Alert (Urgent)</option>
            </select>

            {/* Category */}
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Sector"
              className="bg-bg border border-border text-text text-xs rounded-md px-2.5 py-1 font-mono outline-none w-28"
            />

            {/* Due Date */}
            <input
              type="date"
              value={editDueDate.substring(0, 10)}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="bg-bg border border-border text-text text-xs rounded-md px-2.5 py-1 font-mono outline-none cursor-pointer"
            />

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs rounded-md bg-surface hover:bg-surface-hover border border-border text-text-muted hover:text-text font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs rounded-md bg-accent hover:bg-accent-hover text-accent-foreground font-bold font-mono"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  const pStyle = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <div
      className={`group bg-surface/90 hover:bg-surface-hover border rounded-xl p-4 mb-2.5 transition-all flex items-start gap-3.5 ${
        task.completed
          ? 'border-border/40 opacity-60 bg-surface/40'
          : isOverdue
          ? 'border-danger/40 danger-glow bg-surface'
          : 'border-border hover:border-accent/50'
      }`}
    >
      {/* Containment Toggle Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        onClick={() => toggleTask(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all border shrink-0 focus-ring ${
          task.completed
            ? 'bg-accent border-accent text-accent-foreground portal-glow-subtle'
            : 'border-border hover:border-accent bg-bg text-transparent'
        }`}
      >
        <CheckIcon size={14} className={task.completed ? 'block' : 'hidden'} />
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span
            onClick={() => toggleTask(task.id)}
            className={`text-sm font-medium cursor-pointer break-words transition-all ${
              task.completed
                ? 'line-through text-text-muted'
                : 'text-text hover:text-accent font-semibold'
            }`}
          >
            {task.title}
          </span>
        </div>

        {task.description && (
          <p
            className={`text-xs mt-1 break-words font-sans ${
              task.completed ? 'text-text-faint line-through' : 'text-text-muted'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Badges & Telemetry Row */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-mono">
          {/* Priority */}
          <span
            className={`px-2 py-0.5 rounded-md border uppercase tracking-wider font-bold text-[10px] ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
          >
            {pStyle.tag}
          </span>

          {/* Category */}
          {task.category && (
            <span className={`px-2 py-0.5 rounded-md border flex items-center gap-1 text-[10px] font-semibold ${categoryTheme(task.category)}`}>
              <TagIcon size={10} />
              #{task.category}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span
              className={`px-2 py-0.5 rounded-md border flex items-center gap-1.5 text-[10px] ${
                isOverdue
                  ? 'bg-danger-faint border-danger/40 text-danger font-bold animate-pulse'
                  : 'bg-bg border border-border text-text-muted'
              }`}
            >
              <CalendarIcon size={11} className={isOverdue ? 'text-danger' : 'text-text-faint'} />
              <span>{formatDue(task.dueDate)}</span>
              {isOverdue && <span>[CONTAINMENT BREACH]</span>}
            </span>
          )}
        </div>
      </div>

      {/* Item Action Controls */}
      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          aria-label="Edit directive"
          className="p-1.5 rounded-md hover:bg-surface-active text-text-muted hover:text-accent transition-colors focus-ring"
        >
          <EditIcon size={15} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          aria-label="Delete directive"
          className="p-1.5 rounded-md hover:bg-danger-faint text-text-muted hover:text-danger transition-colors focus-ring"
        >
          <TrashIcon size={15} />
        </button>
      </div>
    </div>
  );
}
