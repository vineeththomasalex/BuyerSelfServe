import React from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { Card, CardBody, CardHeader } from '../common';
import { formatDateShort, getDaysUntilText, isOverdue, addDays } from '../../utils/dates';

export function UpcomingDeadlines() {
  const { transaction, tasks, getIncompleteDependencies } = useTransaction();

  if (!transaction?.effectiveDate) {
    return null;
  }

  // Find tasks with deadlines
  const tasksWithDeadlines = tasks
    .filter((t) => t.isEnabled && !t.completed && t.deadlineType !== 'none')
    .map((task) => {
      let deadlineDate: string | null = null;

      if (task.deadlineType === 'fixed_date' && task.deadlineDate) {
        deadlineDate = task.deadlineDate;
      } else if (task.deadlineType === 'days_from_effective' && task.deadlineDays !== null) {
        deadlineDate = addDays(transaction.effectiveDate!, task.deadlineDays);
      }

      return {
        task,
        deadlineDate,
        incompleteDeps: getIncompleteDependencies(task.id),
      };
    })
    .filter((item) => item.deadlineDate !== null)
    .sort((a, b) => {
      if (!a.deadlineDate || !b.deadlineDate) return 0;
      return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
    })
    .slice(0, 5);

  if (tasksWithDeadlines.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="divide-y divide-gray-100">
          {tasksWithDeadlines.map(({ task, deadlineDate, incompleteDeps }) => (
            <li key={task.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  {incompleteDeps.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Needs: {incompleteDeps.map((d) => d.title).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end text-right">
                  <span
                    className={`text-sm font-medium ${
                      isOverdue(deadlineDate!)
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {formatDateShort(deadlineDate)}
                  </span>
                  <span
                    className={`text-xs ${
                      isOverdue(deadlineDate!)
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {getDaysUntilText(deadlineDate!)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
