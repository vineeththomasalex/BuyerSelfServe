import React from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { PhaseCard } from './PhaseCard';
import { UpcomingDeadlines } from './UpcomingDeadlines';

interface PipelineViewProps {
  onPhaseClick: (phaseId: string) => void;
}

export function PipelineView({ onPhaseClick }: PipelineViewProps) {
  const { phaseStates } = useTransaction();

  // Split phases into two rows
  const topRow = phaseStates.slice(0, 5);
  const bottomRow = phaseStates.slice(5);

  return (
    <div className="space-y-6">
      {/* Phase Cards Grid */}
      <div className="space-y-4">
        {/* Top row - 5 phases */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {topRow.map((phaseState, index) => (
            <React.Fragment key={phaseState.phase.id}>
              <PhaseCard
                phaseState={phaseState}
                onClick={() => onPhaseClick(phaseState.phase.id)}
              />
              {index < topRow.length - 1 && (
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom row - 4 phases */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {bottomRow.map((phaseState, index) => (
            <React.Fragment key={phaseState.phase.id}>
              <PhaseCard
                phaseState={phaseState}
                onClick={() => onPhaseClick(phaseState.phase.id)}
              />
              {index < bottomRow.length - 1 && (
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <UpcomingDeadlines />
    </div>
  );
}
