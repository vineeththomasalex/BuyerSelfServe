import React from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { TaskRow } from './TaskRow';
import { Card } from '../common';

interface TaskListProps {
  phaseId: string;
  onTaskClick: (taskId: string) => void;
}

export function TaskList({ phaseId, onTaskClick }: TaskListProps) {
  const { tasks } = useTransaction();

  const phaseTasks = tasks.filter((t) => t.phaseId === phaseId);

  // Separate into categories
  const enabledTasks = phaseTasks.filter((t) => t.isEnabled);
  const disabledTasks = phaseTasks.filter((t) => !t.isEnabled);

  const todoTasks = enabledTasks.filter(
    (t) => !t.completed && !(t.skipped || false)
  );
  const skippedTasks = enabledTasks.filter(
    (t) => !t.completed && (t.skipped || false)
  );
  const completedTasks = enabledTasks.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      {/* To Do Tasks */}
      {todoTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            To Do ({todoTasks.length})
          </h3>
          <Card className="overflow-hidden">
            {todoTasks.map((task) => (
              <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </Card>
        </div>
      )}

      {/* Skipped Tasks */}
      {skippedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            Skipped for Later ({skippedTasks.length})
          </h3>
          <Card className="overflow-hidden">
            {skippedTasks.map((task) => (
              <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </Card>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Completed ({completedTasks.length})
          </h3>
          <Card className="overflow-hidden">
            {completedTasks.map((task) => (
              <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </Card>
        </div>
      )}

      {/* Disabled/Conditional Tasks */}
      {disabledTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full" />
            Not Applicable ({disabledTasks.length})
          </h3>
          <Card className="overflow-hidden">
            {disabledTasks.map((task) => (
              <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </Card>
        </div>
      )}

      {phaseTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks in this phase
        </div>
      )}
    </div>
  );
}
