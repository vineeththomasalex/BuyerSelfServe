import React, { useState } from 'react';
import { Task } from '../../types';
import { useTransaction } from '../../hooks/useTransaction';
import { ConditionalBadge } from '../common';
import { formatDateShort, getDaysUntilText, addDays, isOverdue } from '../../utils/dates';

interface TaskRowProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

export function TaskRow({ task, onTaskClick }: TaskRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTask, skipTask, unskipTask, getIncompleteDependencies, transaction } = useTransaction();
  const incompleteDeps = getIncompleteDependencies(task.id);

  // Calculate deadline if applicable
  let deadlineDate: string | null = null;
  if (task.deadlineType === 'fixed_date' && task.deadlineDate) {
    deadlineDate = task.deadlineDate;
  } else if (
    task.deadlineType === 'days_from_effective' &&
    task.deadlineDays !== null &&
    transaction?.effectiveDate
  ) {
    deadlineDate = addDays(transaction.effectiveDate, task.deadlineDays);
  }

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask(task.id, { completed: !task.completed });
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.skipped) {
      unskipTask(task.id);
    } else {
      skipTask(task.id);
    }
  };

  if (!task.isEnabled) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 opacity-50">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 border-2 border-gray-300 rounded bg-gray-100" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 line-through">{task.title}</p>
          {task.condition && (
            <ConditionalBadge condition={task.condition} className="mt-1" />
          )}
        </div>
        <span className="text-xs text-gray-400">Disabled</span>
      </div>
    );
  }

  // Collapsed view for completed tasks
  if (task.completed && !isExpanded) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-green-50/50 border-b border-gray-100">
        <div className="flex-shrink-0">
          <button
            onClick={handleToggleComplete}
            className="w-5 h-5 border-2 rounded flex items-center justify-center bg-green-600 border-green-600 text-white"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 line-through">{task.title}</p>
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1 text-gray-400 hover:text-gray-600"
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
      className={`flex items-start gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        task.completed ? 'bg-green-50/50' : task.skipped ? 'bg-orange-50/50' : ''
      }`}
      onClick={() => onTaskClick(task.id)}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 pt-0.5">
        <button
          onClick={handleToggleComplete}
          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-600 border-green-600 text-white'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p
            className={`text-sm font-medium ${
              task.completed ? 'text-gray-500 line-through' : task.skipped ? 'text-orange-700' : 'text-gray-900'
            }`}
          >
            {task.title}
          </p>
          {task.condition && <ConditionalBadge condition={task.condition} />}
          {task.skipped && !task.completed && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
              Skipped
            </span>
          )}
        </div>

        {/* Timing info */}
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
          <span>Your time: {task.userTimeEstimate}</span>
          {task.externalWaitTime !== 'N/A' && (
            <span>Wait: {task.externalWaitTime}</span>
          )}
        </div>

        {/* Dependencies (informational, not blocking) */}
        {incompleteDeps.length > 0 && !task.completed && (
          <div className="flex items-center gap-1 mt-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-blue-700">
              Needs: {incompleteDeps.map((d) => d.title).join(', ')}
            </span>
          </div>
        )}

        {/* External dependency */}
        {(task.externalDependency || (task as any).externalBlocker) && !task.completed && (
          <div className="flex items-center gap-1 mt-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-gray-500">
              Waiting on: {task.externalDependency || (task as any).externalBlocker}
            </span>
          </div>
        )}
      </div>

      {/* Deadline */}
      {deadlineDate && !task.completed && (
        <div className="flex-shrink-0 text-right">
          <p
            className={`text-sm font-medium ${
              isOverdue(deadlineDate) ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {formatDateShort(deadlineDate)}
          </p>
          <p
            className={`text-xs ${
              isOverdue(deadlineDate) ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {getDaysUntilText(deadlineDate)}
          </p>
        </div>
      )}

      {/* Status / Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {task.completed ? (
          <>
            <span className="text-xs text-green-600 font-medium">Done</span>
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="Collapse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </>
        ) : (
          <button
            onClick={handleSkip}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              task.skipped
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {task.skipped ? 'Unskip' : 'Skip'}
          </button>
        )}
      </div>
    </div>
  );
}
