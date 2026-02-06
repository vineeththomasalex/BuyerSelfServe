import React from 'react';
import { StageState, StageStatus } from '../../types';

interface StageNavItemProps {
  stageState: StageState;
  isActive: boolean;
  onClick: () => void;
}

export function StageNavItem({ stageState, isActive, onClick }: StageNavItemProps) {
  const { stage, status, completedTasks, enabledTasks } = stageState;

  const getStatusIndicator = (status: StageStatus, isActive: boolean) => {
    if (status === 'complete') {
      return (
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-500 text-white">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500" />
      );
    }
    return (
      <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
    );
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2.5 rounded-lg transition-colors
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {getStatusIndicator(status, isActive)}
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
            {stage.shortName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {completedTasks}/{enabledTasks}
          </div>
        </div>
      </div>
    </button>
  );
}
