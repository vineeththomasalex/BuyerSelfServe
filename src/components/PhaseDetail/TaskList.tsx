import React, { useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { TaskRow } from './TaskRow';
import { Card } from '../common';

interface TaskListProps {
  phaseId: string;
  onTaskClick: (taskId: string) => void;
}

export function TaskList({ phaseId, onTaskClick }: TaskListProps) {
  const { tasks } = useTransaction();
  const [showNotApplicable, setShowNotApplicable] = useState(false);

  const phaseTasks = tasks.filter((t) => t.phaseId === phaseId);

  // Separate enabled and disabled, keep original order
  const enabledTasks = phaseTasks.filter((t) => t.isEnabled);
  const disabledTasks = phaseTasks.filter((t) => !t.isEnabled);

  const completedCount = enabledTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      {enabledTasks.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {completedCount} of {enabledTasks.length} tasks completed
        </div>
      )}

      {/* All enabled tasks in original order */}
      {enabledTasks.length > 0 && (
        <Card className="overflow-hidden">
          {enabledTasks.map((task) => (
            <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </Card>
      )}

      {/* Disabled/Conditional Tasks - Collapsible */}
      {disabledTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowNotApplicable(!showNotApplicable)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2 hover:text-gray-600"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showNotApplicable ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="w-2 h-2 bg-gray-300 rounded-full" />
            Not Applicable ({disabledTasks.length})
          </button>
          {showNotApplicable && (
            <Card className="overflow-hidden">
              {disabledTasks.map((task) => (
                <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
              ))}
            </Card>
          )}
        </div>
      )}

      {phaseTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks in this phase
        </div>
      )}

      {/* All complete message */}
      {enabledTasks.length > 0 && completedCount === enabledTasks.length && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <svg className="w-8 h-8 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">All tasks in this phase complete!</p>
        </div>
      )}
    </div>
  );
}
