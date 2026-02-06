import React, { useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { CommunicationLog as CommunicationLogType } from '../../types';
import { getRoleLabel } from '../../data/stakeholderRoles';
import { SlidePanel, Button, Input, Select, TextArea, Card, CardBody } from '../common';
import { formatDate, toISODate } from '../../utils/dates';

interface CommunicationLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunicationLog({ isOpen, onClose }: CommunicationLogProps) {
  const {
    communicationLogs,
    addCommunicationLog,
    deleteCommunicationLog,
    stakeholders,
  } = useTransaction();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState<Omit<CommunicationLogType, 'id' | 'transactionId'>>({
    stakeholderId: '',
    taskId: null,
    date: toISODate(new Date()),
    type: 'call',
    summary: '',
    followUpNeeded: false,
    followUpDate: null,
  });

  const handleAdd = () => {
    if (!newLog.stakeholderId || !newLog.summary) return;
    addCommunicationLog(newLog);
    setNewLog({
      stakeholderId: '',
      taskId: null,
      date: toISODate(new Date()),
      type: 'call',
      summary: '',
      followUpNeeded: false,
      followUpDate: null,
    });
    setShowAddForm(false);
  };

  const handleDelete = (logId: string) => {
    if (confirm('Delete this log entry?')) {
      deleteCommunicationLog(logId);
    }
  };

  const getStakeholderName = (stakeholderId: string) => {
    const stakeholder = stakeholders.find((s) => s.id === stakeholderId);
    if (!stakeholder) return 'Unknown';
    return stakeholder.name || getRoleLabel(stakeholder.role);
  };

  const typeLabels: Record<CommunicationLogType['type'], string> = {
    call: 'Phone Call',
    email: 'Email',
    text: 'Text Message',
    in_person: 'In Person',
    other: 'Other',
  };

  // Sort logs by date descending
  const sortedLogs = [...communicationLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Communication Log" side="left" width="w-[450px]">
      <div className="p-4 space-y-6">
        {/* Add Button */}
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Log Communication
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">New Log Entry</h4>
            <Select
              label="Contact"
              value={newLog.stakeholderId}
              onChange={(e) => setNewLog({ ...newLog, stakeholderId: e.target.value })}
              options={[
                { value: '', label: 'Select contact...' },
                ...stakeholders.map((s) => ({
                  value: s.id,
                  label: s.name || getRoleLabel(s.role),
                })),
              ]}
            />
            <Select
              label="Type"
              value={newLog.type}
              onChange={(e) =>
                setNewLog({ ...newLog, type: e.target.value as CommunicationLogType['type'] })
              }
              options={Object.entries(typeLabels).map(([value, label]) => ({ value, label }))}
            />
            <Input
              label="Date"
              type="date"
              value={newLog.date}
              onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
            />
            <TextArea
              label="Summary"
              value={newLog.summary}
              onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
              placeholder="What was discussed..."
            />
            <div className="flex items-center gap-4 flex-wrap">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newLog.followUpNeeded}
                  onChange={(e) =>
                    setNewLog({ ...newLog, followUpNeeded: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Follow-up needed</span>
              </label>
              {newLog.followUpNeeded && (
                <Input
                  type="date"
                  value={newLog.followUpDate || ''}
                  onChange={(e) => setNewLog({ ...newLog, followUpDate: e.target.value || null })}
                  className="w-40"
                />
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" onClick={handleAdd} disabled={!newLog.stakeholderId || !newLog.summary}>
                Add Entry
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Log Entries */}
        {sortedLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No communication logged yet.</p>
            <p className="text-sm mt-1">Track your communications with contacts here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedLogs.map((log) => (
              <Card key={log.id}>
                <CardBody className="!py-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {getStakeholderName(log.stakeholderId)}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                          {typeLabels[log.type]}
                        </span>
                        {log.followUpNeeded && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                            Follow-up
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(log.date)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(log.id)}
                      className="!px-2 text-red-600 hover:text-red-700 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{log.summary}</p>
                  {log.followUpDate && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                      Follow up by: {formatDate(log.followUpDate)}
                    </p>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SlidePanel>
  );
}
