import React, { useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { phases } from '../../data/phases';
import { Button, Card, CardBody, TextArea, StatusBadge, ProgressBar } from '../common';
import { TaskList } from './TaskList';
import { TaskDetailModal } from './TaskDetailModal';

interface PhaseDetailViewProps {
  phaseId: string;
  onBack: () => void;
  onOpenPdfFiller: (documentId: string) => void;
}

export function PhaseDetailView({ phaseId, onBack, onOpenPdfFiller }: PhaseDetailViewProps) {
  const { getPhaseState } = useTransaction();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [phaseNotes, setPhaseNotes] = useState('');

  const phase = phases.find((p) => p.id === phaseId);
  const phaseState = getPhaseState(phaseId);

  if (!phase || !phaseState) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Phase not found</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">
          Back to Overview
        </Button>
      </div>
    );
  }

  const progressColor = {
    complete: 'green' as const,
    active: 'blue' as const,
    pending: 'gray' as const,
  }[phaseState.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Overview
        </button>
      </div>

      {/* Phase Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Phase {phase.number}: {phase.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
          </div>
          <StatusBadge status={phaseState.status} />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1">
            <ProgressBar
              value={phaseState.completedTasks}
              max={phaseState.enabledTasks}
              color={progressColor}
              size="md"
            />
          </div>
          <span className="text-sm text-gray-600">
            {phaseState.completedTasks}/{phaseState.enabledTasks} tasks complete
            {phaseState.skippedTasks > 0 && ` (${phaseState.skippedTasks} skipped)`}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span>Typical timing: Days {phase.typicalDaysStart} - {phase.typicalDaysEnd} from Effective Date</span>
        </div>
      </div>

      {/* Task List */}
      <TaskList phaseId={phaseId} onTaskClick={(taskId) => setSelectedTaskId(taskId)} />

      {/* Phase Notes */}
      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Phase Notes</h3>
          <TextArea
            value={phaseNotes}
            onChange={(e) => setPhaseNotes(e.target.value)}
            placeholder="Add notes for this phase..."
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <Button variant="secondary" size="sm">
              Save Notes
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onOpenPdfFiller={onOpenPdfFiller}
      />
    </div>
  );
}
