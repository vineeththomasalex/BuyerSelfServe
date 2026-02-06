import React from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { Modal, Button, Input, Toggle } from './common';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { transaction, updateTransaction, resetTransaction } = useTransaction();

  if (!transaction) return null;

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all data? This will delete your transaction, tasks, snippets, and all saved information.'
      )
    ) {
      resetTransaction();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="space-y-6">
        {/* Transaction Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Transaction Details</h3>
          <div className="space-y-4">
            <Input
              label="Property Address"
              value={transaction.propertyAddress}
              onChange={(e) => updateTransaction({ propertyAddress: e.target.value })}
              placeholder="123 Main Street, Austin, TX 78701"
            />
            <Input
              label="Legal Description"
              value={transaction.legalDescription}
              onChange={(e) => updateTransaction({ legalDescription: e.target.value })}
              placeholder="Lot 5, Block 2, Sunny Acres Subdivision"
            />
            <Input
              label="Purchase Price"
              type="number"
              value={transaction.purchasePrice || ''}
              onChange={(e) =>
                updateTransaction({ purchasePrice: parseInt(e.target.value) || 0 })
              }
              placeholder="450000"
            />
            <Input
              label="Effective Date"
              type="date"
              value={transaction.effectiveDate || ''}
              onChange={(e) =>
                updateTransaction({ effectiveDate: e.target.value || null })
              }
            />
            <Input
              label="Closing Date"
              type="date"
              value={transaction.closingDate || ''}
              onChange={(e) => updateTransaction({ closingDate: e.target.value || null })}
            />
          </div>
        </div>

        {/* Conditional Flags */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Transaction Type</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            These settings enable or disable certain tasks based on your transaction type.
          </p>
          <div className="space-y-4">
            <Toggle
              checked={transaction.hasLoan}
              onChange={(checked) => updateTransaction({ hasLoan: checked })}
              label="Financing with a mortgage loan (vs. cash purchase)"
            />
            <Toggle
              checked={transaction.hasHOA}
              onChange={(checked) => updateTransaction({ hasHOA: checked })}
              label="Property is in a Homeowners Association (HOA)"
            />
            <Toggle
              checked={transaction.isNewConstruction}
              onChange={(checked) => updateTransaction({ isNewConstruction: checked })}
              label="New construction (vs. resale)"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This will permanently delete all your transaction data. This action cannot be
            undone.
          </p>
          <Button variant="danger" onClick={handleReset}>
            Reset All Data
          </Button>
        </div>
      </div>
    </Modal>
  );
}
