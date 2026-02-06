import React, { useState } from 'react';
import { Stakeholder } from '../../types';
import { useTransaction } from '../../hooks/useTransaction';
import { getRoleLabel } from '../../data/stakeholderRoles';
import { Card, CardBody, Button, Input, TextArea } from '../common';

interface StakeholderCardProps {
  stakeholder: Stakeholder;
}

export function StakeholderCard({ stakeholder }: StakeholderCardProps) {
  const { updateStakeholder, deleteStakeholder } = useTransaction();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(stakeholder);

  const handleSave = () => {
    updateStakeholder(stakeholder.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(stakeholder);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this contact?')) {
      deleteStakeholder(stakeholder.id);
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardBody className="space-y-3">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {getRoleLabel(stakeholder.role)}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {stakeholder.name || 'No name'}
            </p>
            {stakeholder.company && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{stakeholder.company}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="!px-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="!px-2 text-red-600 hover:text-red-700"
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
        </div>

        {(stakeholder.phone || stakeholder.email) && (
          <div className="mt-3 space-y-1">
            {stakeholder.phone && (
              <a
                href={`tel:${stakeholder.phone}`}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {stakeholder.phone}
              </a>
            )}
            {stakeholder.email && (
              <a
                href={`mailto:${stakeholder.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {stakeholder.email}
              </a>
            )}
          </div>
        )}

        {stakeholder.notes && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
            {stakeholder.notes}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
