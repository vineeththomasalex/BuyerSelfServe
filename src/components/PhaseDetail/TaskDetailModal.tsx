import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { useTransaction } from '../../hooks/useTransaction';
import { Modal, Button, TextArea, ConditionalBadge } from '../common';
import { formatDate, addDays, getDaysUntilText, isOverdue } from '../../utils/dates';
import { getDocumentById } from '../../data/documents';
import { getRoleLabel } from '../../data/stakeholderRoles';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
  onOpenPdfFiller: (documentId: string) => void;
}

export function TaskDetailModal({ taskId, onClose, onOpenPdfFiller }: TaskDetailModalProps) {
  const { getTaskById, updateTask, skipTask, unskipTask, getIncompleteDependencies, tasks, transaction } =
    useTransaction();

  const [notes, setNotes] = useState('');

  const task = taskId ? getTaskById(taskId) : null;

  useEffect(() => {
    if (task) {
      setNotes(task.notes);
    }
  }, [task]);

  if (!task) return null;

  const incompleteDeps = getIncompleteDependencies(task.id);
  const dependentTasks = tasks.filter((t) => {
    const deps = t.dependsOn || (t as any).blockedBy || [];
    return deps.includes(task.id) && t.isEnabled;
  });

  // Calculate deadline
  let deadlineDate: string | null = null;
  if (task.deadlineType === 'fixed_date' && task.deadlineDate) {
    deadlineDate = task.deadlineDate;
  } else if (
    task.deadlineType === 'days_from_effective' &&
    task.deadlineDays !== null &&
    transaction?.effectiveDate
  ) {
    deadlineDate = addDays(transaction.effectiveDate, task.deadlineDays);
  }

  const handleSaveNotes = () => {
    updateTask(task.id, { notes });
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleToggleSkip = () => {
    if (task.skipped) {
      unskipTask(task.id);
    } else {
      skipTask(task.id);
    }
  };

  // Determine status display
  const getStatusInfo = () => {
    if (task.completed) {
      return { label: 'Completed', className: 'bg-green-100 text-green-800' };
    }
    if (task.skipped) {
      return { label: 'Skipped', className: 'bg-orange-100 text-orange-800' };
    }
    return { label: 'To Do', className: 'bg-blue-100 text-blue-800' };
  };

  const statusInfo = getStatusInfo();

  return (
    <Modal isOpen={!!taskId} onClose={onClose} title={task.title} size="lg">
      <div className="space-y-6">
        {/* Status and Condition */}
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}
          >
            {statusInfo.label}
          </span>
          {task.condition && <ConditionalBadge condition={task.condition} />}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Time Required</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.userTimeEstimate}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">External Wait Time</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.externalWaitTime}</p>
          </div>
        </div>

        {/* Deadline */}
        {deadlineDate && (
          <div
            className={`p-3 rounded-lg ${
              isOverdue(deadlineDate) ? 'bg-red-50 dark:bg-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'
            }`}
          >
            <p
              className={`text-xs mb-1 ${
                isOverdue(deadlineDate) ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
              }`}
            >
              Deadline
            </p>
            <p
              className={`text-sm font-semibold ${
                isOverdue(deadlineDate) ? 'text-red-900 dark:text-red-300' : 'text-yellow-900 dark:text-yellow-300'
              }`}
            >
              {formatDate(deadlineDate)} ({getDaysUntilText(deadlineDate)})
            </p>
          </div>
        )}

        {/* Dependencies */}
        <div className="grid grid-cols-2 gap-4">
          {/* Depends On */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Depends On</h4>
            {(task.dependsOn || (task as any).blockedBy || []).length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No dependencies</p>
            ) : (
              <ul className="space-y-1">
                {(task.dependsOn || (task as any).blockedBy || []).map((depId: string) => {
                  const dep = tasks.find((t) => t.id === depId);
                  if (!dep) return null;
                  const isComplete = dep.completed || !dep.isEnabled;
                  return (
                    <li
                      key={depId}
                      className={`text-sm flex items-center gap-2 ${
                        isComplete ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {dep.title}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Depended On By */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Depended On By</h4>
            {dependentTasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No dependent tasks</p>
            ) : (
              <ul className="space-y-1">
                {dependentTasks.map((depTask) => (
                  <li key={depTask.id} className="text-sm text-gray-600 dark:text-gray-400">
                    {depTask.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Incomplete Dependencies Info */}
        {incompleteDeps.length > 0 && !task.completed && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Needs Completion First</p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {incompleteDeps.map((d) => d.title).join(', ')}
            </p>
          </div>
        )}

        {/* Instructions */}
        {task.instructions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-2">
              {task.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Related Documents */}
        {task.relatedDocuments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Related Documents</h4>
            <div className="space-y-2">
              {task.relatedDocuments.map((docId) => {
                const doc = getDocumentById(docId);
                if (!doc) return null;
                return (
                  <div
                    key={docId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                      {doc.trecFormNumber && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.trecFormNumber}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenPdfFiller(docId)}
                      >
                        Fill PDF
                      </Button>
                      <a
                        href={doc.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Official Form
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Stakeholder */}
        {task.relatedStakeholderRole && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Relevant Contact</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getRoleLabel(task.relatedStakeholderRole)}
            </p>
          </div>
        )}

        {/* External Dependency */}
        {(task.externalDependency || (task as any).externalBlocker) && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Waiting On</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.externalDependency || (task as any).externalBlocker}</p>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Notes</h4>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this task..."
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <Button variant="secondary" size="sm" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {task.completedAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed: {formatDate(task.completedAt)}
              </p>
            )}
            {task.skippedAt && !task.completed && (
              <p className="text-sm text-orange-500 dark:text-orange-400">
                Skipped: {formatDate(task.skippedAt)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!task.completed && (
              <Button
                variant={task.skipped ? 'secondary' : 'ghost'}
                onClick={handleToggleSkip}
              >
                {task.skipped ? 'Unskip' : 'Skip for Later'}
              </Button>
            )}
            <Button
              variant={task.completed ? 'secondary' : 'primary'}
              onClick={handleToggleComplete}
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
