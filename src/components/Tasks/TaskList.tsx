import React, { useState } from 'react';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onSkip: (taskId: string) => void;
  onUnskip: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
  onOpenPdf?: (docId: string) => void;
  getIncompleteDependencies: (taskId: string) => Task[];
}

export function TaskList({
  tasks,
  onToggleComplete,
  onSkip,
  onUnskip,
  onViewDetails,
  onOpenPdf,
  getIncompleteDependencies,
}: TaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [showNotApplicable, setShowNotApplicable] = useState(false);

  // Group tasks by status
  const enabledTasks = tasks.filter((t) => t.isEnabled);
  const disabledTasks = tasks.filter((t) => !t.isEnabled);

  const todoTasks = enabledTasks.filter((t) => !t.completed && !t.skipped);
  const skippedTasks = enabledTasks.filter((t) => t.skipped && !t.completed);
  const completedTasks = enabledTasks.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      {/* To Do */}
      {todoTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            To Do ({todoTasks.length})
          </h3>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onSkip={onSkip}
                onUnskip={onUnskip}
                onViewDetails={onViewDetails}
                onOpenPdf={onOpenPdf}
                incompleteDependencies={getIncompleteDependencies(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Skipped */}
      {skippedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Skipped for Later ({skippedTasks.length})
          </h3>
          <div className="space-y-3">
            {skippedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onSkip={onSkip}
                onUnskip={onUnskip}
                onViewDetails={onViewDetails}
                onOpenPdf={onOpenPdf}
                incompleteDependencies={getIncompleteDependencies(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed - Collapsible */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onSkip={onSkip}
                  onUnskip={onUnskip}
                  onViewDetails={onViewDetails}
                  onOpenPdf={onOpenPdf}
                  incompleteDependencies={[]}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Not Applicable - Collapsible */}
      {disabledTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowNotApplicable(!showNotApplicable)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-600 dark:hover:text-gray-400"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showNotApplicable ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Not Applicable ({disabledTasks.length})
          </button>
          {showNotApplicable && (
            <div className="space-y-3 opacity-50">
              {disabledTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-dashed rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 dark:text-gray-500">{task.title}</span>
                    {task.condition && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({task.condition.type === 'has_loan' && 'Requires loan'}
                        {task.condition.type === 'has_hoa' && 'Requires HOA'}
                        {task.condition.type === 'is_new_construction' && 'New construction only'})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {todoTasks.length === 0 && skippedTasks.length === 0 && completedTasks.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">All tasks complete!</p>
        </div>
      )}
    </div>
  );
}
