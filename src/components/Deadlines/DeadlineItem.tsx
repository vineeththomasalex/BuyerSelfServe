import React from 'react';
import { DeadlineItem as DeadlineItemType } from '../../types';

interface DeadlineItemProps {
  deadline: DeadlineItemType;
  onClick?: () => void;
}

export function DeadlineItem({ deadline, onClick }: DeadlineItemProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysLabel = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `in ${days} days`;
  };

  const urgencyColor = deadline.isUrgent
    ? 'border-l-red-500 bg-red-50 dark:bg-red-900/30'
    : deadline.isUpcoming
    ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/30'
    : 'border-l-gray-300 dark:border-l-gray-600 bg-white dark:bg-gray-800';

  const textColor = deadline.isUrgent
    ? 'text-red-700 dark:text-red-400'
    : deadline.isUpcoming
    ? 'text-orange-700 dark:text-orange-400'
    : 'text-gray-700 dark:text-gray-300';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 border-l-4 rounded-r-lg
        ${urgencyColor}
        hover:bg-opacity-70 transition-colors
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${textColor}`}>
            {formatDate(deadline.deadlineDate)}
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100 truncate mt-0.5">
            {deadline.taskTitle}
          </div>
          {deadline.amount && (
            <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-0.5">
              ${deadline.amount.toLocaleString()}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className={`text-xs ${deadline.isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {getDaysLabel(deadline.daysUntil)}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {deadline.stageName}
        </span>
      </div>
    </button>
  );
}
