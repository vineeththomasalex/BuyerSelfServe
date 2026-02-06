import React from 'react';
import { StageId, Task } from '../../types';
import { useTransaction } from '../../hooks/useTransaction';
import { StageHeader } from './StageHeader';
import { TaskList } from '../Tasks/TaskList';

interface StageViewProps {
  stageId: StageId;
  onViewTaskDetails: (taskId: string) => void;
  onOpenPdf?: (docId: string) => void;
}

export function StageView({ stageId, onViewTaskDetails, onOpenPdf }: StageViewProps) {
  const {
    getStageState,
    getTasksForStage,
    updateTask,
    skipTask,
    unskipTask,
    getIncompleteDependencies,
  } = useTransaction();

  const stageState = getStageState(stageId);
  const tasks = getTasksForStage(stageId);

  if (!stageState) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Stage not found
      </div>
    );
  }

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  const handleSkip = (taskId: string) => {
    skipTask(taskId);
  };

  const handleUnskip = (taskId: string) => {
    unskipTask(taskId);
  };

  return (
    <div>
      <StageHeader stageState={stageState} />
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onSkip={handleSkip}
        onUnskip={handleUnskip}
        onViewDetails={onViewTaskDetails}
        onOpenPdf={onOpenPdf}
        getIncompleteDependencies={getIncompleteDependencies}
      />
    </div>
  );
}
