import React, { useState } from 'react';
import { Task } from '../../types';
import { TaskTypeBadge } from './TaskTypeBadge';
import { ConditionalBadge } from '../common';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onSkip: (taskId: string) => void;
  onUnskip: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
  onOpenPdf?: (docId: string) => void;
  incompleteDependencies?: Task[];
}

export function TaskCard({
  task,
  onToggleComplete,
  onSkip,
  onUnskip,
  onViewDetails,
  onOpenPdf,
  incompleteDependencies = [],
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDependencies = incompleteDependencies.length > 0;
  const isSkipped = task.skipped && !task.completed;
  const isCollapsed = task.completed && !isExpanded;

  // Collapsed view for completed tasks
  if (isCollapsed) {
    return (
      <div
        className="border rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 flex items-center gap-3"
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white dark:bg-gray-800"
        />
        <span className="flex-1 text-gray-400 dark:text-gray-500 line-through text-sm">
          {task.title}
        </span>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Expand"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all
        ${task.completed ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
        ${isSkipped ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => onToggleComplete(task.id, e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white dark:bg-gray-800"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-medium ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}
            >
              {task.title}
            </h3>
            {task.completed && (
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                aria-label="Collapse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <TaskTypeBadge type={task.taskType || 'action'} />
            {task.condition && <ConditionalBadge condition={task.condition} />}
            {task.relatedDocuments.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </span>
            )}
          </div>

          {/* Time estimate and dependencies */}
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {task.userTimeEstimate && task.userTimeEstimate !== 'N/A' && (
              <span>{task.userTimeEstimate}</span>
            )}
            {hasDependencies && !task.completed && (
              <span className={task.userTimeEstimate && task.userTimeEstimate !== 'N/A' ? 'ml-2' : ''}>
                <span className="text-amber-600 dark:text-amber-400">
                  Needs: {incompleteDependencies.map((d) => d.title).join(', ')}
                </span>
              </span>
            )}
          </div>

          {/* Completed info */}
          {task.completed && task.completedAt && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              Completed {new Date(task.completedAt).toLocaleDateString()}
            </div>
          )}

          {/* Actions */}
          {!task.completed && (
            <div className="flex items-center gap-2 mt-3">
              {isSkipped ? (
                <button
                  onClick={() => onUnskip(task.id)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Unskip
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onViewDetails(task.id)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Details
                  </button>
                  {task.relatedDocuments.length > 0 && onOpenPdf && (
                    <button
                      onClick={() => onOpenPdf(task.relatedDocuments[0])}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                      Fill PDF
                    </button>
                  )}
                  <button
                    onClick={() => onSkip(task.id)}
                    className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                  >
                    Skip for later
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
