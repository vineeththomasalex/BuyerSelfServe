import React, { useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { stakeholderRoles } from '../../data/stakeholderRoles';
import { StakeholderRole } from '../../types';
import { SlidePanel, Button, Input, Select, TextArea } from '../common';
import { StakeholderCard } from './StakeholderCard';

interface StakeholderListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StakeholderList({ isOpen, onClose }: StakeholderListProps) {
  const { stakeholders, addStakeholder } = useTransaction();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState({
    role: 'seller' as StakeholderRole,
    name: '',
    company: '',
    phone: '',
    email: '',
    notes: '',
  });

  const handleAddStakeholder = () => {
    addStakeholder(newStakeholder);
    setNewStakeholder({
      role: 'seller',
      name: '',
      company: '',
      phone: '',
      email: '',
      notes: '',
    });
    setShowAddForm(false);
  };

  // Group stakeholders by role
  const groupedStakeholders = stakeholderRoles.reduce((acc, roleInfo) => {
    acc[roleInfo.role] = stakeholders.filter((s) => s.role === roleInfo.role);
    return acc;
  }, {} as Record<StakeholderRole, typeof stakeholders>);

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Contacts" side="left" width="w-96">
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
            Add Contact
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">New Contact</h4>
            <Select
              label="Role"
              value={newStakeholder.role}
              onChange={(e) =>
                setNewStakeholder({ ...newStakeholder, role: e.target.value as StakeholderRole })
              }
              options={stakeholderRoles.map((r) => ({ value: r.role, label: r.label }))}
            />
            <Input
              label="Name"
              value={newStakeholder.name}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
              placeholder="Full name"
            />
            <Input
              label="Company"
              value={newStakeholder.company}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, company: e.target.value })}
              placeholder="Company name"
            />
            <Input
              label="Phone"
              value={newStakeholder.phone}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, phone: e.target.value })}
              placeholder="(512) 555-1234"
            />
            <Input
              label="Email"
              value={newStakeholder.email}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
              placeholder="email@example.com"
            />
            <TextArea
              label="Notes"
              value={newStakeholder.notes}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, notes: e.target.value })}
              placeholder="Additional notes..."
            />
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" onClick={handleAddStakeholder}>
                Add Contact
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Stakeholder Cards */}
        {stakeholders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No contacts added yet.</p>
            <p className="text-sm mt-1">Add contacts for the people involved in your transaction.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stakeholders.map((stakeholder) => (
              <StakeholderCard key={stakeholder.id} stakeholder={stakeholder} />
            ))}
          </div>
        )}
      </div>
    </SlidePanel>
  );
}
