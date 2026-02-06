import React from 'react';
import { DeadlineItem as DeadlineItemType } from '../../types';
import { DeadlineItem } from './DeadlineItem';

interface DeadlineListProps {
  deadlines: DeadlineItemType[];
  onDeadlineClick?: (taskId: string, stageId: string) => void;
}

export function DeadlineList({ deadlines, onDeadlineClick }: DeadlineListProps) {
  const urgentDeadlines = deadlines.filter((d) => d.isUrgent);
  const upcomingDeadlines = deadlines.filter((d) => !d.isUrgent && d.isUpcoming);
  const laterDeadlines = deadlines.filter((d) => !d.isUrgent && !d.isUpcoming);

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No deadlines yet</p>
        <p className="text-xs mt-1">Set an effective date to see deadlines</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Urgent */}
      {urgentDeadlines.length > 0 && (
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Urgent
          </h4>
          <div className="space-y-2">
            {urgentDeadlines.map((deadline) => (
              <DeadlineItem
                key={deadline.taskId}
                deadline={deadline}
                onClick={() => onDeadlineClick?.(deadline.taskId, deadline.stageId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcomingDeadlines.length > 0 && (
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upcoming
          </h4>
          <div className="space-y-2">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineItem
                key={deadline.taskId}
                deadline={deadline}
                onClick={() => onDeadlineClick?.(deadline.taskId, deadline.stageId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Later */}
      {laterDeadlines.length > 0 && (
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Later
          </h4>
          <div className="space-y-2">
            {laterDeadlines.map((deadline) => (
              <DeadlineItem
                key={deadline.taskId}
                deadline={deadline}
                onClick={() => onDeadlineClick?.(deadline.taskId, deadline.stageId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
