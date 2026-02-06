import React from 'react';
import { TaskType } from '../../types';

interface TaskTypeBadgeProps {
  type: TaskType;
  size?: 'sm' | 'md';
}

const typeConfig: Record<TaskType, { label: string; color: string; icon: string }> = {
  action: {
    label: 'Action',
    color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z', // Lightning bolt
  },
  paperwork: {
    label: 'Paperwork',
    color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', // Document
  },
  payment: {
    label: 'Payment',
    color: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Dollar
  },
  waiting: {
    label: 'Waiting',
    color: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', // Clock
  },
};

export function TaskTypeBadge({ type, size = 'sm' }: TaskTypeBadgeProps) {
  const config = typeConfig[type];
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-2.5 py-1 text-sm gap-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} ${config.color} rounded-full font-medium`}
    >
      <svg
        className={iconSize}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={config.icon}
        />
      </svg>
      {config.label}
    </span>
  );
}
