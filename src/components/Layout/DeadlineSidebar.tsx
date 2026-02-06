import React from 'react';
import { DeadlineItem, StageId } from '../../types';
import { DeadlineList } from '../Deadlines';

interface DeadlineSidebarProps {
  deadlines: DeadlineItem[];
  closingDate: string | null;
  onDeadlineClick?: (taskId: string, stageId: StageId) => void;
}

export function DeadlineSidebar({ deadlines, closingDate, onDeadlineClick }: DeadlineSidebarProps) {
  const formatClosingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilClosing = (dateStr: string) => {
    const closing = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    closing.setHours(0, 0, 0, 0);
    return Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Deadlines
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <DeadlineList
          deadlines={deadlines}
          onDeadlineClick={(taskId, stageId) => onDeadlineClick?.(taskId, stageId as StageId)}
        />
      </div>

      {/* Closing Date at bottom */}
      {closingDate && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/30">
          <div className="text-center">
            <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">
              Closing Day
            </div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
              {formatClosingDate(closingDate)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
              in {getDaysUntilClosing(closingDate)} days
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
