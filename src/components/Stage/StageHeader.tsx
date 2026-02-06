import React from 'react';
import { StageState } from '../../types';
import { ProgressBar } from '../common';

interface StageHeaderProps {
  stageState: StageState;
}

export function StageHeader({ stageState }: StageHeaderProps) {
  const { stage, completedTasks, enabledTasks } = stageState;
  const progress = enabledTasks > 0 ? (completedTasks / enabledTasks) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stage.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{stage.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {completedTasks} of {enabledTasks} tasks
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      <ProgressBar value={completedTasks} max={enabledTasks} size="md" />
    </div>
  );
}
