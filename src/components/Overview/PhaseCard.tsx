import React from 'react';
import { PhaseState } from '../../types';
import { Card, CardBody, ProgressBar, StatusBadge } from '../common';

interface PhaseCardProps {
  phaseState: PhaseState;
  onClick: () => void;
}

export function PhaseCard({ phaseState, onClick }: PhaseCardProps) {
  const { phase, status, completedTasks, skippedTasks, enabledTasks } = phaseState;

  const progressColor = {
    complete: 'green' as const,
    active: 'blue' as const,
    pending: 'gray' as const,
  }[status];

  return (
    <Card hoverable onClick={onClick} className="flex flex-col min-w-[140px]">
      <CardBody className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-gray-500">
            {phase.number}. {phase.shortName}
          </span>
        </div>

        <ProgressBar
          value={completedTasks}
          max={enabledTasks}
          color={progressColor}
          size="md"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {completedTasks}/{enabledTasks} done
            {skippedTasks > 0 && ` (${skippedTasks} skipped)`}
          </span>
        </div>

        <StatusBadge status={status} />
      </CardBody>
    </Card>
  );
}
