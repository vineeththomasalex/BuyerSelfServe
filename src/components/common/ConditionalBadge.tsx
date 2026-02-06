import React from 'react';
import { TaskCondition } from '../../types';

interface ConditionalBadgeProps {
  condition: TaskCondition;
  className?: string;
}

export function ConditionalBadge({ condition, className = '' }: ConditionalBadgeProps) {
  const getLabel = () => {
    switch (condition.type) {
      case 'has_hoa':
        return 'IF HOA';
      case 'has_loan':
        return 'IF LOAN';
      case 'is_new_construction':
        return 'IF NEW';
      case 'custom':
        return condition.label;
      default:
        return 'CONDITIONAL';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 ${className}`}
    >
      {getLabel()}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'complete' | 'active' | 'pending';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles = {
    complete: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    active: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    pending: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  };

  const labels = {
    complete: 'COMPLETE',
    active: 'ACTIVE',
    pending: 'PENDING',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]} ${className}`}
    >
      {labels[status]}
    </span>
  );
}
